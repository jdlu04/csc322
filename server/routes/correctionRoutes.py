## Temporary File for holding LLM-endpoints
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import sys
# Needs full system path to access LLM folder -> please lmk if there is a better solution to this
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from llm.llmCorrect import run_editor
from llm.differences import get_word_diffs
from dotenv import load_dotenv
import ollama, re, difflib


# Hashed out to test for /llm-correct endpoint
load_dotenv()
mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL, tlsAllowInvalidCertificates=True)
db = client["TIFIdb"]
users_col = db["users"] # temporarily using since there are 2 DBs for users?
##token_col = db["tokens"]
text_col = db["textupload"] # temp db for holding uploaded LLM text -> will be cleaning/updating
save_col = db["save_text"]  # temp db name for saving text -> NEED TO FOLLOW UP W. YARED FOR NAME
llm_col = db["llm_responses"]   # temp db just for holding llm responses

# CRUD:
# POST --> 200, 400
# GET --> 200, 500
# UPDATE --> 200, 400
# DELETE --> 200, 400

correction_bp = Blueprint('correction_bp', __name__)

# Endpoint for submitting text or file (should handle token deduction or rejection) -> not complete yet 
# Description: Free/Paid user submits text or file -> meaning need to establish a connection with userDB
# Logic: get the userId info stuff thing -> check for token count -> etc
@correction_bp.route('/submit-text', methods=['POST'])
def text():
    # Need to get the username
    data = request.get_json()
    username = data['username']
    input_text = data['text']

    if not data or 'username' not in data:
        return jsonify({"Error":"Username required"}), 400

    user = users_col.find_one({"username":username})
    if not user:
        return jsonify({"Error":"User not found"}), 404
    if 'text' not in data:
        return jsonify({"Error":"Text required"}), 400
    
    # Get the word-token conversion
    token_count = len(re.findall(r'\S+', input_text))
    # Check user_col db for the user's tokens
    avaliable_tokens = user.get("tokens", 0)
    # Return _id for the user -> unique identifier; need to convert to string
    user['_id'] = str(user['_id'])

    if token_count > avaliable_tokens:
        return jsonify({
            "Error":"Insufficient tokens",
            "required_tokens":token_count,
            "avaliable_tokens":avaliable_tokens
        }), 403
    return jsonify({
        "username":username,
        "userId":user['_id'],
        "text":input_text, 
        "avaliable_tokens":avaliable_tokens,
        "token_count":token_count
    }), 200

#@correction_bp.route('/self-correct', methods=['POST'])

# Endpoint for sending text to LLM and returns corrections for review
@correction_bp.route('/llm-correct', methods=['POST'])
def review_text():
    try:
        data = request.get_json()
        username = data.get("username")
        input_text = data.get("text")

        if not username:
            return "Username required", 400

        if not input_text:
            return "Text required", 400

        user = users_col.find_one({"username": username})
        if not user:
            return "User not found", 404

        corrected = run_editor(input_text)

        if not isinstance(corrected, str):
            return "LLM engine must return a string", 500

        text_doc = {
            "userId": user["_id"],
            "username": username,
            "original": input_text,
            "corrected": corrected
        }

        llm_col.insert_one(text_doc)

        return corrected, 200, {'Content-Type': 'text/plain'}

    except Exception as e:
        print("ERROR in /llm-correct:", e)
        return f"Server error: {str(e)}", 500, {'Content-Type': 'text/plain'}

# Endpoint for Accepting a specific correction (deducted 1 token)
@correction_bp.route('/llm-correct/update', methods=['POST'])
def llm_update():
    data = request.get_json()
    username = data.get("username")
    text = data.get("text")
    updated_text = data.get("updated")

    # Logic: get username, corrected text field, and text to update the corrected text inside the llm-responses
    if not data or 'username' not in data:
        return jsonify({"Error":"Username required"}), 400
        
    user = users_col.find_one({"username":username})
    if not user:
        return jsonify({"Error":"User not found"}), 404
    
    # Get the user tokens amt for deduction
    user_tokens = user.get("tokens", 0)
    if user_tokens <= 0:
        return jsonify({"Error":"Insufficient tokens"}), 403
    
    llm_doc = llm_col.find_one({
        "username":username,
        "corrected":text
    })

    # Check for if the 'corrected' text matches
    if not llm_doc:
        return jsonify({"Error": "Original corrected text not found"}), 404

    result = llm_col.update_one(
        {"_id": llm_doc["_id"]},
        {"$set": {"corrected": updated_text}}
    )

    if result.modified_count == 1:
        token_update = users_col.update_one(
            {"_id":user["_id"]}, 
            {"$inc":{"tokens":-1}}
        )
        return jsonify({
            "Success": "Text Updated",
            "remaining_tokens":user_tokens-1
            }), 200
    else:
        return jsonify({"Error": "Update failed or no change detected"}), 500

@correction_bp.route('/llm-correct/approve', methods=['POST'])
def llm_approve():
    data = request.get_json()
    original = data.get("original")
    corrected = data.get("corrected")
    
    diffs = get_word_diffs(original, corrected)

    return jsonify(diffs), 200

# Endpoint for Rejecting a specific correction, submitting a reason for super user to review
# @correction_bp.route('/llm-correct/reject', methods=['POST'])

# Endpoint for saving wrongly flagged word as "correct" --> ?
# @correction_bp.route('/llm-correction/save-as-correct', methods=['POST'])
# def save_correct():

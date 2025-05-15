## Temporary File for holding LLM-endpoints
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import sys
# Needs full system path to access LLM folder -> please lmk if there is a better solution to this
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from llm.llmCorrect import run_editor
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

    user = token_col.find_one({"username":username})
    if not user:
        return jsonify({"Error":"User not found"}), 404
    if 'text' not in data:
        return jsonify({"Error":"Text required"}), 400
    
    # Get the word-token conversion
    token_count = len(re.findall(r'\S+', input_text))
    # Check token_col db for the user's tokenBalance
    avaliable_tokens = user.get("tokenBalance", 0)
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
    data = request.json
    # CONSIDERING ADDING USERNAME SO IT MATCHES THE RESULTING TEXTUPLOAD DB STUFF
    # username = data['username']
    text = data.get("text")

    if not text:
        return jsonify({"Error":"Text required"}), 400
    result = run_editor(text)

    return jsonify(result), 200

# Endpoint for Accepting a specific correction (deducted 1 token)
@correction_bp.route('/llm-correct/accept', methods=['POST'])
def llm_accept():
    data = request.json
    # May not need but in case want to return user specific response:
    # username = data.get["username"]
    # Assuming you have the resulting JSON from /llm-correct:
    original = data.get("original", "")
    corrected = data.get("corrected", "")
    decisions = data.get("decisions", [])

    # original_words = original_text.split()
    # corrected_words = corrected_text.split()
    
    if not original or corrected:
        return jsonify({"Error":"Missing text"}), 400
    # Still trying to figure out the implementation -> thinking of using difflib to get the differences
    # And then using decisions array as what the resulting text should be 
    # Basically building a "final" text from the accepted changes -> reject would be the opposite
    pass
    

# Endpoint for Rejecting a specific correction, submitting a reason for super user to review
#@correction_bp.route('/llm-correct/reject', methods=['POST'])

# Endpoint for saving wrongly flagged word as "correct" --> ?
# @correction_bp.route('/llm-correction/save-as-correct', methods=['POST'])
# def save_correct():

# Endpoint for saving file 
@correction_bp.route('/save-file', methods=['POST'])
def saveFile():
    data = request.get_json()
    username = data['username']
    text = data['text']

    # ----> need to check if they are a paid user first;
    # Logic: check db["users"] & then userType="Paid User"; if not, then return error
    if not data or 'username' not in data:
        return jsonify({"Error":"Username required"}), 400
    # sanity check -> Looks up user name in db['users']
    user = users_col.find_one({"username":username})
    if not user:
        return jsonify({"Error":"Username not found"}), 404
    
    if not text:
        return jsonify({"Error":"Text required"}), 400
    
    # Check if userType = Paid
    if user.get("userType") != "Paid User":
        return jsonify({"Error": "Access restricted to paid users"}), 403
    
    token_count = len(re.findall(r'\S+', text))
    avaliable_tokens = user.get("tokens", 0)
    remaining_tokens = avaliable_tokens - token_count
    
    # Check if the required token_count of text and avaliable token count of user difference
    if remaining_tokens < 5:
        return jsonify({"Error":"Not enough tokens in balance"}), 403
    
    new_bal = remaining_tokens - 5

    # Update user tokens after deduction
    users_col.update_one(
        {"_id": user["_id"]}, 
        {"$set": {"tokens": new_bal}}
    )

    text_doc = {
        "userId":user["_id"],
        "username":user["username"],
        "text": text
    }

    text_col.insert_one(text_doc)

    return jsonify({ "message": "Text document created", "userId": str(user["_id"]), "remainingTokens": new_bal}), 201
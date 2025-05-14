## Temporary File for holding LLM-endpoints
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import sys
# Needs full system path to access LLM folder -> please lmk if there is a better solution to this
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from llm.llmCorrect import run_editor
from dotenv import load_dotenv
import ollama, re


# Hashed out to test for /llm-correct endpoint
load_dotenv()
mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL, tlsAllowInvalidCertificates=True)
db = client["TIFIdb"]
users_col = db["users"] # temporarily using since there are 2 DBs for users?
token_col = db["tokens"]
text_col = db["textupload"] # temp db for holding uploaded LLM text -> will be cleaning/updating

# CRUD:
# POST --> 200, 400
# GET --> 200, 500
# UPDATE --> 200, 400
# DELETE --> 200, 400

llm_bp = Blueprint('llm_bp', __name__)

# Endpoint for submitting text or file (should handle token deduction or rejection) -> not complete yet 
# Description: Free/Paid user submits text or file -> meaning need to establish a connection with userDB
# Logic: get the userId info stuff thing -> check for token count -> etc
@llm_bp.route('/submit-text', methods=['POST'])
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

#@llm_bp.route('/self-correct', methods=['POST'])

# Endpoint for sending text to LLM and returns corrections for review
@llm_bp.route('/llm-correct', methods=['POST'])
def review_text():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"Error":"Text required"}), 400
    result = run_editor(text)

    return jsonify(result), 200

# Endpoint for Accepting a specific correction (deducted 1 token)
# @llm_bp.route('/llm-correct/accept', methods=['POST'])
# def llm_accept():
#    data = request.json

# Endpoint for Rejecting a specific correction, submitting a reason for super user to review
#@llm_bp.route('/llm-correct/reject', methods=['POST'])

# Endpoint for saving wrongly flagged word as "correct" --> ?
# @llm_bp.route('/llm-correction/save-as-correct', methods=['POST'])
# def save_correct():

# Endpoint for saving file 
@llm_bp.route('/save-file', methods=['POST'])
def saveFile():
    data = request.json()
    username = data['username']
    text = data['text']

    # ----> need to check if they are a paid user first;
    # Logic: check db["users"] & then userType="Paid User"; if not, then return error
    if not data or 'username' not in data:
        return jsonify({"Error":"Username required"}), 400
    user = users_col.find_one({"username":username})
    if not user:
        return jsonify({"Error":"Username not found"}), 404
    
    userType = user.get("")
    
    if not text:
        return jsonify({"Error":"Text required"}), 400
    
    token_count = len(re.findall(r'\S+', text))
    avaliable_tokens = user.get("tokenBalance", 0)
    remaining_tokens = avaliable_tokens - token_count
    
    # Check if the required token_count of text and avaliable token count of user difference
    if remaining_tokens < 5:
        return jsonify({"Error":"Not enough tokens in balance"})
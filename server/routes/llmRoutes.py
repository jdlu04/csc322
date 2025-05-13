## Temporary File for holding LLM-endpoints
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import sys
# Needs full system path to access LLM folder -> please lmk if there is a better solution to this
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from llm.llmCorrect import run_editor
from dotenv import load_dotenv
import ollama

# Hashed out to test for /llm-correct endpoint
load_dotenv()
mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]
users_col = db["free_users"] # temporarily using since there are 2 DBs for users? 
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
    username = request.form.get('username')
    if not username:
        return jsonify({"Error":"username required"}), 400
    # Fetching username from MongoDB & checking for username
    users = users_col.find_one(users_col.find({"username":username}))
    if not user:
        return jsonify({"Error":"User not found"}), 404
    for user in users:
        user["_id"]=str(user["_id"])
    

    data = request.json
    text = data.get("text")

@llm_bp.route('/self-correct', methods=['POST'])

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
@llm_bp.route('/llm-correct/accept', methods=['POST'])

# Endpoint for Rejecting a specific correction, submitting a reason for super user to review
@llm_bp.route('/llm-correct/reject', methods=['POST'])


## Temporary File for holding LLM-endpoints
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import sys
# Needs full system path to access LLM folder -> please lmk if there is a better solution to this
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from llm.llm_correct import run_editor
from dotenv import load_dotenv
import ollama

# Hashed out to test for /llm-correct endpoint
# load_dotenv()
# mongoURL = os.getenv("DB_URL")
# client = MongoClient(mongoURL)
# db = client["TIFIdb"]
# collection = db["textupload"]

llm_bp = Blueprint('llm_bp', __name__)

# Endpoint for submitting text or file (should handle token deduction or rejection) -> not complete yet 
@llm_bp.route('/submit-text', methods=['POST'])

# Endpoint for sending text to LLM and returns corrections for review
@llm_bp.route('/llm-correct', methods=['POST'])
def review_text():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"Error":"Text required"}), 400
    result = run_editor(text)

    return jsonify(result), 200

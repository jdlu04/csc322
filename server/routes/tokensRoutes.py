# Sample Tokens Endpoints for Testing Purposes
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os, ollama
from dotenv import load_dotenv

load_dotenv()

token_bp = Blueprint('tokens_bp', __name__)

mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL, tlsAllowInvalidCertificates=True)
db = client["TIFIdb"]
user_col = db["users"]
###token_col = db["tokens"] # temp db for tokens
# CRUD:
# POST --> 200, 400
# GET --> 200, 500
# UPDATE --> 200, 400
# DELETE --> 200, 400

@token_bp.route('/tokens/buy', methods=['POST'])
def buyTokens():
    data = request.get_json()

    if not data or 'username' not in data:
        return jsonify({"Error":"Missing username"}), 400
    
    username = data['username']

    user = user_col.find_one({"username":username})
    if not user:
        return jsonify({"Error":"User not found"}), 404
    
    if token_col.find_one({"userId":user["_id"]}):
        return jsonify({"Error":"Token document already exists for this user"}), 409
    
    token_doc = {
        "userId":user["_id"],
        "username":user["username"],
        "tokenBalance": 10
    }

    token_col.insert_one(token_doc)

    return jsonify({ "message": "Token document created", "userId": str(user["_id"]) }), 201
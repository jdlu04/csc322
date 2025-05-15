# In a new file called tokens.py (PART 1)
# server/routes/tokens.py
from flask import Blueprint, request, jsonify, session
from bson import ObjectId
from pymongo import MongoClient
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

tokens_bp = Blueprint("tokens", __name__)

# Accessing Database
mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]
collection = db["users"]


# Display Token Balance
@tokens_bp.route("/api/tokens", methods=["GET"])
@jwt_required()
def get_token_balance():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    user = collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check if the user has a "tokens" field in the database
    return jsonify({"tokens": user.get("tokens", 0)})


# Add to Token Balance
@tokens_bp.route("/api/tokens/award", methods=["POST"])
@jwt_required()
def award_tokens():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    user = collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.json
    tokenAmt = data.get("amount")
    
    # Log to check if 'amount' is in the request and if it's a valid number
    print("Received token amount:", tokenAmt)
    
    if not tokenAmt:
        return jsonify({"error": "Amount is missing or invalid"}), 422

    if not isinstance(tokenAmt, int):  # Ensuring it's an integer
        return jsonify({"error": "Invalid amount, must be an integer"}), 400
    
    # Add the tokens to the user's balance
    current_tokens = user.get("tokens", 0)
    new_total = current_tokens + tokenAmt

    # Update the user's token balance in the database
    collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"tokens": new_total}})

    return jsonify({"message": "Tokens awarded", "new_balance": new_total}), 200


# (Part 2)

# Subtract from Token balance
@tokens_bp.route("/api/tokens/spend", methods=["POST"])
def spend_tokens():
    user_id = get_jwt_idenity()
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    user = collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.json
    tokenAmt = data.get("amount") 
    
    if not isinstance(tokenAmt, int): # Checks to see if amount is an integer
        return jsonify({"error": "Invalid amount"}), 400
    
    # Add the tokens to the user's balance
    current_tokens = user.get("tokens", 0)

    # If a user overspends
    if current_tokens < tokenAmt: # Checks to see if amount is an integer
        # Halve the balance as a penalty
        new_total = current_tokens // 2

        # Update the user's token balance in the database
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"tokens":new_total}})
        return jsonify({"error": "Exceeded balance, token balance halved", "new_balance" : new_total}), 400
    
    # Otherwise subtract tokens from the balance
    new_total = current_tokens - tokenAmt

    # Update the user's token balance in the database
    collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"tokens": new_total}})

    return jsonify({"message": "Tokens spent", "new_balance": new_total}), 200
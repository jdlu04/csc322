from flask import Blueprint, request, jsonify, session
from bson.errors import InvalidId
from pymongo import MongoClient
from bson import ObjectId
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity
)
from pymongo.errors import PyMongoError
import os

## universal, when someone blacklists a word, it's blacklisted for everyone
## blueprint 
blacklist_bp = Blueprint('blacklist', __name__) ## gotta initialize it like the... initializer

## for now I'll use a hard coded connection
## actually this might not be bad... cuz we can have
## roles a s parameter then update that parameter based on free, paid, super like we discussed

mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]

blacklist_collection = db["blacklist"]

@blacklist_bp.route('/blacklist', methods=["GET"])
def get_blacklist():
    approved_words = blacklist_collection.find({"status": "approved"}, {"word": 1, "_id": 0})
    words_list = [entry["word"] for entry in approved_words]
    return jsonify(words_list), 200

@blacklist_bp.route('/blacklist/approve', methods=["POST"])
@jwt_required()
def approve_blacklist():
    user_id = get_jwt_identity()
    user = collection.find_one({"_id": ObjectId(user_id)})

    if user.get("role") != "superuser":
        return jsonify({"error": "unauthorized"}), 403 

    data = request.get_json()
    word_id = data.get("id")
    result = blacklist_collection.update_one(
        {"_id": ObjectId(word_id), "status": "pending"},
        {"$set": {"status": "approved"}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Word not found or has already been processed"}), 404
    
    return jsonify({"message": "Proposed word has been approved"}), 200

@blacklist_bp.route('/blacklist/reject', methods=["DELETE"])
@jwt_required()
def reject_blacklist():
    user_id = get_jwt_identity()
    user = collection.find_one({"_id": ObjectId(user_id)})

    if user.get("role") != "superuser":
        return jsonify({"error": "unauthorized"}), 403 
    
    data = request.get_json()
    word_id = data.get("id")

    result = blacklist_collection.update_one(
        {"_id": ObjectId(word_id), "status": "pending"},
        {"$set": {"status": "rejected"}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Word not found or has already processed"}), 404

    return jsonify({"message": "Word rejected!"}), 200

@blacklist_bp.route('/blacklist/pending', methods=["GET"])
@jwt_required()
def pending_blacklist():
    user_id = get_jwt_identity()
    user = collection.find_one({"_id": ObjectId(user_id)})

    if user.get("role") != "superuser":
        return jsonify({"error": "Unauthorized"}), 403
    
    pending = blacklist_collection.find({"status": "pending"}, {"word": 1})
    return jsonify([{"word": p["word"], "id": str(p["_id"])} for p in pending]), 200

@blacklist_bp.route('/blacklist/suggest', methods=["POST"])
@jwt_required()
def suggest_blacklist():
    user_id = get_jwt_identity()
    data = request.get_json()
    word = data.get("word", "").strip().lower()

    if not word.isalpha():
        return jsonify({"error": "Invalid word"}), 400
    
    existing = blacklist_collection.find_one({"word": word})

    if existing:
        return jsonify({"error": "The word has already been suggested or blacklisted"}), 409
    
    blacklist_collection.insert_one({
        "word": word,
        "status": "pending",
        "suggested_by": ObjectId(user_id)
    })

    return jsonify({"message": "Word suggested for blacklist"}), 201



from flask import Blueprint, request, jsonify, session
from bson.errors import InvalidId
from pymongo import MongoClient
from bson import ObjectId
'''from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity
)'''
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

## boilerplate for blacklist endpoints

@blacklist_bp.route('/blacklist', methods=["GET"])
def get_blacklist():
    ##pass
    approved_words = blacklist_collection.find({"status": "approved"}, {"id": 0, "word": 1})
    ## what about when there are no black listed words available?
    return jsonify([entry["word"] for entry in approved_words]), 200

@blacklist_bp.route('/blacklist/approve', methods=["POST"])
def approve_blacklist():
    user_id = get_jwt_identity()
    user = collection.find_one({"_id": ObjectId(user_id)})

    ## only superusers can approve 
    ## anyone else is forbbiden from approving blacklisted word
    if user.get("role") != "superuser":
        return jsonify({"error": "unauthorized"}), 403 
    
    ## if they're a super user let's just pass in the approved blacklisted word
    data = request.get_json()
    word_id = data.get("id")
    result = blacklist_collection.update_one(
        {"_id": ObjectId(word_id), "status": "pending"},
        {"$set": {"status": "approved"}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Word not found or has already been processed"}), 404
    
    return jsonify({"message": "Proposed word has been approved"}), 200

@blacklist_bp.route('/blacklist/reject', methods=["DELETE"]) ## idk yet
def reject_blacklist():
    ##pass
    user_id = get_jwt_identity()
    user = collection.find_one({"_id": ObjectId(user_id)})

    if user.get("role") != "superuser":
        return jsonify({"error": "unauthorized"}), 403 
    
    ## same concept as approving words just with rejecting them,
    ## i'll be passing in data via a json request, just to get data and view everything
    data = request.get_json()
    word_id = data.get("id") ## I have to grab the id the word is at from our list of pending blacklist words

    ## from their we can jsut update the word at that id from pending to rejected
    ## looks like a 2 objects, id at word 
    ## set the status of that word to rejected 
    result = blacklist_collection.update_one(
        {"_id": ObjectId(word_id), "status": "pending"},
        {"$set": {"status": "rejected"}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "word not found or already processed"})

    return jsonify({"message": "Word rejected!"}), 200

## these are words in process of being rejected or added to the blacklist
@blacklist_bp.route('/blacklist/pending', methods=["GET"]) ## i think it's a get endpoint
def pending_blacklist():
    pass

@blacklist_bp.route('/blacklist/suggest', methods=["POST"])
def suggest_blacklist():
    pass




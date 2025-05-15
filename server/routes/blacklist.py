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

## GET
@blacklist_bp.route('/blacklist', methods=["GET"])
def get_blacklist():
    pass

@blacklist_bp.route('/blacklist/approve', methods=["POST"])
def approve_blacklist():
    pass

@blacklist_bp.route('/blacklist/reject', methods=["DELETE"]) ## idk yet
def reject_blacklist():
    pass

## these are words in process of being rejected or added to the blacklist
@blacklist_bp.route('/blacklist/pending', methods=["GET"]) ## i think it's a get endpoint
def pending_blacklist():
    pass

@blacklist_bp.route('/blacklist/suggest', methods=["POST"])
def suggest_blacklist():
    pass





# Amanda Note, added session from flask, This will allow login sessions
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

###from dotenv import load_dotenv 

## initiali free users
## they sohuld have a username 
## password
## some user_id (for mongo)
## then it should indicate their role
## the should be modified via system a user can't change their role themselves
## they can upgrade to a paid user though

## blueprint 
user_bp = Blueprint('user_bp', __name__) ## gotta initialize it like the... initializer

## for now I'll use a hard coded connection
## actually this might not be bad... cuz we can have
## roles a s parameter then update that parameter based on free, paid, super like we discussed

mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]

collection = db["users"]
text_col = db["textupload"]

##CRUD: 
## POST --> 200, 400
## GET --> 200, 500
## UPDATE --> 200, 400
## DELETE --> 200, 400

# Amanda Note # Updated to automatically add 10 tokens
# To users who signed up
@user_bp.route('/users', methods=['POST'])
def postUser():
    data = request.json

    # Automatically give 10 tokens
    data["tokens"] = 10

    result = collection.insert_one(data)

    return jsonify({
        "message": "User created", 
        "id": str(result.inserted_id),
        "tokens": data["tokens"]
    }), 200

### we're just getting all users here so this isn't ideal
### this I can change tmr but it will allow us to at least verify if we've established a connection
### NEXT and flask

@user_bp.route('/users', methods=['GET'])
def getUser():
    users = list(collection.find())

    ## we're setting ther user id as a string
    for user in users:
        user["_id"] = str(user["_id"])
    return jsonify(users), 200

## it's required to know the users id.... we should instead probably
## have it be by name... I can fix this in the morning...
@user_bp.route('/users/<id>', methods=['PATCH'])
## we can update a user based on id
def updateUser(id):
    data = request.json
    try:
        object_id = ObjectId(id)
        result = collection.update_one(
            {"_id": object_id},
            {"$set": data}
        )

        if result.modified_count == 1:
            return jsonify({
                "message": "user updated"
            }), 200
        
    except InvalidId: 
        return jsonify(
            {"error": "Invalid user ID format"}
        ), 400
    
    except Exception as error:
        return jsonify({"error": str(error)}), 500

### delete
@user_bp.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        result = collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify(
                {"message": "User deleted"}
            ), 200
        return jsonify(
            {"error": "User not found"}
        ), 404
    
    except InvalidId:
        return jsonify(
            {"error": "Invalid user ID format"}
        ), 400
    
    except Exception as error:
        return jsonify(
            {"error": str(error)}
        ), 500

#login endpoint
#http://127.0.0.1:5000/login
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["password"] != password:
        return jsonify({"error": "Incorrect password"}), 401

    ## Amanda Testing Tokens ##
    session["user_id"] = str(user["_id"])

    user["_id"] = str(user["_id"])
    user.pop("password") 
    access_token = create_access_token(identity=str(user["_id"]))

    ## super important that we also get the user's type upon login for JWT
    return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
            "userType": user.get("userType")
        }
    }), 200

@user_bp.route('/collab', methods=['POST'])
@jwt_required()
def collab():
    ##pass
    data = request.json
    file_id = data.get('file_id')
    invitee_username = data.get('invitee_username')

    if not file_id or not invitee_username:
        return jsonify({"error": "Missing file_id or invitee_username"}), 400

    try:
        file_obj_id = ObjectId(file_id)
    except:
        return jsonify({"error": "Invalid file_id format"}), 400

    inviter_id = get_jwt_identity()
    inviter_obj_id = ObjectId(inviter_id)

    try:
        file = files_collection.find_one({"_id": file_obj_id})
        if not file:
            return jsonify({"error": "File not found"}), 404

        if file.get("owner_id") != inviter_obj_id:
            return jsonify({"error": "Only the owner can invite users"}), 403

        invitee = users_collection.find_one({"username": invitee_username})
        if not invitee:
            return jsonify({"error": "Invitee user not found"}), 404

        invitee_id = invitee["_id"]

        files_collection.update_one(
            {"_id": file_obj_id},
            {"$addToSet": {"collaborators": invitee_id}}
        )

        return jsonify({"message": "User successfully invited"}), 201

    except PyMongoError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500

### FILES Endpoints ###
@user_bp.route('/files', methods=['GET'])
@jwt_required()
def files():
    user_id = get_jwt_identity()

    try:
        user_obj_id = ObjectId(user_id)

        files = list(text_col.find({
            "$or": [
                {"owner_id": user_obj_id},
                {"collaborators": user_obj_id}
            ]
        }))

        for f in files:
            f["_id"] = str(f["_id"])
            f["owner_id"] = str(f["owner_id"])
            f["collaborators"] = [str(uid) for uid in f.get("collaborators", [])]
            f["pending_invites"] = [str(uid) for uid in f.get("pending_invites", [])]

            # ✅ fetch the owner's username instead of email
            owner = users_col.find_one({"_id": ObjectId(f["owner_id"])})
            f["owner_username"] = owner.get("username", "Unknown") if owner else "Unknown"

        return jsonify(files), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to retrieve files",
            "details": str(e)
        }), 500
    
@user_bp.route('/files/share', methods=['POST'])
@jwt_required()
def files_share():
    data = request.json
    file_name = data.get('file_name')
    content = data.get('content')

    if not file_name:
        return jsonify({"error": "File name is required"}), 400 
    
    owner_id = get_jwt_identity()

    file_doc = {
        "file_name": file_name,
        "owner_id": ObjectId(owner_id),
        "content": content or "",
        "collaborators": [],
        "pending_invites": []
    }

    try:
        result = text_col.insert_one(file_doc)
        return jsonify({
            "message": "File shared!",
            "file_id": str(result.inserted_id)
        }), 201

    except PyMongoError as e:
        return jsonify({
            "error": "Failed to share file",
            "details": str(e)
        }), 500

@user_bp.route('/files/inviteResponse', methods=['POST'])
@jwt_required()
def invite_response():
    data = request.json
    file_id = data.get('file_id')
    response = data.get('response')

    if not file_id or response not in ("accept", "reject"):
        return jsonify({"error": "file_id and valid response are required"}), 400

    user_id = get_jwt_identity()

    try:
        file_obj_id = ObjectId(file_id)
        user_obj_id = ObjectId(user_id)

        file = text_col.find_one({"_id": file_obj_id})
        if not file:
            return jsonify({"error": "File not found"}), 404
        
        if user_obj_id not in file.get("pending_invites", []):
            return jsonify({"error": "You have no pending invite for this file"}), 403

        if response == "accept":
            update = {
                "$pull": {"pending_invites": user_obj_id},
                "$addToSet": {"collaborators": user_obj_id}
            }
            message = "Invite accepted"
        else:
            update = {"$pull": {"pending_invites": user_obj_id}}
            message = "Invite rejected"

        text_col.update_one({"_id": file_obj_id}, update)

        return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": "Something went wrong", "details": str(e)}), 500
    
@user_bp.route('/save-file', methods=['POST'])
def saveFile():
    data = request.get_json()
    username = data['username']
    text = data['text']

    if not data or 'username' not in data:
        return jsonify({"Error":"Username required"}), 400

    user = users_col.find_one({"username": username})
    if not user:
        return jsonify({"Error":"Username not found"}), 404
    
    if not text:
        return jsonify({"Error":"Text required"}), 400

    if user.get("userType") != "Paid User":
        return jsonify({"Error": "Access restricted to paid users"}), 403
    
    token_count = len(re.findall(r'\S+', text))
    available_tokens = user.get("tokens", 0)
    remaining_tokens = available_tokens - token_count
    
    if remaining_tokens < 5:
        return jsonify({"Error":"Not enough tokens in balance"}), 403
    
    new_bal = remaining_tokens - 5

    users_col.update_one(
        {"_id": user["_id"]}, 
        {"$set": {"tokens": new_bal}}
    )

    text_doc = {
        "userId": user["_id"],
        "username": user["username"],
        "text": text,
        "owner_id": user["_id"],
        "collaborators": [],
        "file_name": "Untitled Document"
    }

    text_col.insert_one(text_doc)

    return jsonify({ 
        "message": "Text document created", 
        "userId": str(user["_id"]), 
        "remainingTokens": new_bal
    }), 201


## user statistics endpoint
@user_bp.route('/stats', methods=["GET"])
@jwt_required()
def user_stat_history():
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    user = collection.find_one({"_id": ObjectId(user_id)}) ## users 

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_type = user.get("userType", "Free User")

    if user_type == "Paid User":
        stats = {
            "tokensUsed": user.get("tokensUsed", 0),
            "tokensAvailable": user.get("tokens", 0),
            "correctionsMade": user.get("correctionsMade", 0)
        }
    else:
        stats = {
            "message": "Upgrade to a paid account to view full statistics.",
            "tokensAvailable": user.get("tokens", 0)
        }

    return jsonify(stats), 200
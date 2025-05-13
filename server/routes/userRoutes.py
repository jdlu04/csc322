
from flask import Blueprint, request, jsonify
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
collection = db["free_users"]
files_collection = db["files"]

##CRUD: 
## POST --> 200, 400
## GET --> 200, 500
## UPDATE --> 200, 400
## DELETE --> 200, 400

@user_bp.route('/users', methods=['POST'])
def postUser():
    data = request.json
    result = collection.insert_one(data)
    
    ## we need to make sure all datais returned as JSON --> jsonify 
    ## return it in dictinary
    return jsonify({
        "message": "User created", 
        "id": str(result.inserted_id)
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

from flask import Blueprint, request, jsonify
from bson.errors import InvalidId
from pymongo import MongoClient
from bson import ObjectId
import os
###from dotenv import load_dotenv <-- we may need this for free, paid, super users.. 

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

mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]
collection = db["free_users"]


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
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify({
            "error": str(error)
        }), 500

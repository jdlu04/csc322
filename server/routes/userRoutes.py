from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

## initiali free users
## they sohuld have a username 
## password
## some user_id (for mongo)
## then it should indicate their role
## the should be modified via system a user can't change their role themselves
## they can upgrade to a paid user though


## for now I'll use a hard coded connection

mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]
collection = db["free_users"]

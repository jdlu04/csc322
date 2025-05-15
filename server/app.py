from flask import Flask, session
from dotenv import load_dotenv
from routes.userRoutes import user_bp 
from routes.correctionRoutes import correction_bp
from flask_cors import CORS
from routes.tokens import tokens_bp
from routes.blacklist import blacklist_bp
from flask_jwt_extended import JWTManager
import secrets
import os

## Load environment variables
load_dotenv() 

app = Flask(__name__)

# gotta allow cors to support frontend URL
CORS(
    app,
    origins=["http://localhost:3000"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Authorization"]
)

# JWT secret key
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
jwt = JWTManager(app)

## Amanda Token Testing ##
app.secret_key = "testing"

app.register_blueprint(user_bp)
app.register_blueprint(tokens_bp)
app.register_blueprint(correction_bp)
app.register_blueprint(blacklist_bp)

# Initializer for app
if __name__ == '__main__':
    # Run Flask app in debug mode for development
    app.run(debug=True)

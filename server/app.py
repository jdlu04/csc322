from flask import Flask, session
from dotenv import load_dotenv
from routes.userRoutes import user_bp 
from routes.correctionRoutes import correction_bp
from flask_cors import CORS
from routes.tokens import tokens_bp
from flask_jwt_extended import JWTManager
import secrets
import os

## I need to make a blue blueprint

## we're .env for any global variable we'll be using throughout our server
load_dotenv() 

app= Flask (__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
jwt = JWTManager(app)
##print(secrets.token_hex(32)) <-- give your JWT_SECRET_KEY
##app = Flask (__name__)

## Amanda Token Testing ##
app.secret_key = "testing"

# Updated CORS(app) to
CORS(app, supports_credentials=True)
## we gotta use the bp here
app.register_blueprint(user_bp)
app.register_blueprint(tokens_bp)
app.register_blueprint(correction_bp)

## initializer 
if __name__ == '__main__':
    ## we're enabling debugging mode here 
    ## so that we can see any error messages during dev
    app.run(debug=True) 

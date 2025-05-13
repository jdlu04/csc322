from flask import Flask
from dotenv import load_dotenv
from routes.userRoutes import user_bp 
from routes.llmRoutes import llm_bp
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import secrets
import os

## I need to make a blue blueprint

## we're .env for any global variable we'll be using throughout our server
load_dotenv() 

app= Flask (__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)
##print(secrets.token_hex(32)) <-- give your JWT_SECRET_KEY
## we gotta use the bp here
app.register_blueprint(user_bp)

app.register_blueprint(llm_bp)

## initializer 
if __name__ == '__main__':
    ## we're enabling debugging mode here 
    ## so that we can see any error messages during dev
    app.run(debug=True) 

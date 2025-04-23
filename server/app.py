from flask import Flask
from dotenv import load_dotenv
from routes.userRoutes import user_bp 

## I need to make a blue blueprint

## we're .env for any global variable we'll be using throughout our server
load_dotenv() 

app= Flask (__name__)

## we gotta use the bp here
app.register_blueprint(user_bp)

## initializer 
if __name__ == '__main__':
    ## we're enabling debugging mode here 
    ## so that we can see any error messages during dev
    app.run(debug=True) 

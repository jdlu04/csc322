from flask import Flask
from dotenv import load_dotenv
from routes.userRoutes import user_bp 

## I need to make a blue blueprint

## we're .env for any global variable we'll be using throughout our server
load_dotenv() 

app= Flask (__name__)

## connecting to our mongo database, need to reachout to the team about setting up db users
## maybe we should've done this is in node.js after all?? --I'm  just being a baby ignore me - yared

'''
mongoURL = os.getenv("DB_URL")
client = MongoClient(mongoURL)
db = client["TIFIdb"]
collection = db["free_users"]
'''

## end points ##

## setting up a basic route at home directory
## I'll be removing this soon
@app.route("/") 
def home():
    return"home endpoint" ## I just wanna see if this it works


## initializer 
if __name__ == '__main__':
    ## we're enabling debugging mode here 
    ## so that we can see any error messages during dev
    app.run(debug=True) 

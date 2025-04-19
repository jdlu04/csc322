from flask import Flask

app= Flask (__name__)

## end points ##

## setting up a basic route at home directory
@app.route("/") 
def home():
    return"home endpoint" ## I just wanna see if this it works

## initializer 
if __name__ == '__main__':
    ## we're enabling debugging mode here 
    ## so that we can see any error messages during dev
    app.run(debug=True) 

How to run the server:

1. Make sure you are inside the 'server' file
    - cd server
2. Create a virtual environment inside the folder:
    - python -m venv venv; OR
    - python3 -m venv venv
3. Activate the virtual environment:
    - source venv/bin/activate
4. Install the requirements:
    - pip install -r requirements.txt; OR
    - pip3 install -r requirements.txt
5. Run the file:
    - python app.py; OR
    - python3 app.py
6. If you are getting a "MissingModule"-type error, try redoing step 4 & 5 with the dev-requirements.txt file instead:
    - pip install -r dev-requirements.txt OR
    - pip3 install -r dev-requirements.txt
    This is error may be due to different modules being used between each person's venv
import os, ollama, json, requests
from tkinter import Tk
from tkinter.filedialog import askopenfilename
from pymongo import MongoClient

def select_file():
    Tk().withdraw()
    input_file = askopenfilename()
    return input_file

def read_file(input_file):
    if not os.path.exists(input_file):
        print(f"Input file '{input_file}' not found")
        exit(1)
    with open(input_file, "r") as f:
        return f.read().strip()

def generate_prompt(text):
    """Create the prompt to send to the LLM."""
    return f"""
You are a text editor that corrects only spelling and grammar. 

Instructions: 
- Correct any spelling and grammar mistakes
- Do NOT change the sentence structure or word choice. 
- Return ONLY a JSON object like this: {{"corrected": "your corrected text here"}}

Text to correct: "{text}"
"""

def run_editor(input_text):
    prompt = generate_prompt(input_text)
    model = "llama3.2:latest"
    temperature = 0
    try:
        response = ollama.generate(model=model, prompt=prompt)
        generated_text = response.get("response", "")
        #print(f"Original Text: \n{input_text}\n")
        #print(generated_text)   # returns as a string -> maybe use JSONIFY to turn into JSON object
        # print(type(generated_text))
        #json_object = json.loads(generated_text)
        fixing_Json(input_text, generated_text)
        
        #return generated_text
    except Exception as e:
        print("An error occurred:", str(e))

def fixing_Json(original_text, response_text):
    # Makes a JSON file with both the original & corrected text
    try:
        json_start = response_text.find("{")
        json_end = response_text.rfind("}")
        if json_start !=1 and json_end != -1:
            json_string = response_text[json_start:json_end+1]
            response_object = json.loads(json_string)
            full_text = {
                "original" : original_text,
                "corrected" : response_object.get("corrected", "")
            }
            with open("response.json", "w") as outfile:
                json.dump(full_text, outfile, indent=4)
        else:
            print("No valid JSON found")
            return None
    except Exception as e:
        print("Error extracting JSON:", e)
        return None

def selection():
    print("Started")
    option = input("Select your input option:\n1-Text Input\n2-File Upload\n")
    if option == "1":
        print("Selected - 1 | Input text")
        entered_text = input("Enter text: ")
        run_editor(entered_text)
        return entered_text
    elif option == "2":
        print("Selected - 2 | Upload text")
        input_file = select_file()
        input_text = read_file(input_file)
        run_editor(input_text)
        return input_text
    else:
        print("Invalid Option Selected")

# Run the full pipeline
if __name__ == "__main__":
    selection()

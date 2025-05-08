import os, ollama, json, requests
from tkinter import Tk
from tkinter.filedialog import askopenfilename

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

Here is a text you need to edit: 
{text}

Please: 
1. Correct all spelling and grammar mistakes. Do not change the sentence structure or word choice. 
2. Return 1 JSON object which contains only the corrected text in the format {{"corrected": "your corrected text here"}}
"""

def run_editor(input_text):
    prompt = generate_prompt(input_text)
    model = "llama3.2:latest"
    try:
        response = ollama.generate(model=model, prompt=prompt)
        generated_text = response.get("response", "")
        print(f"Original Text: \n{input_text}\n")
        #print(generated_text)   # returns as a string -> maybe use JSONIFY to turn into JSON object
        # print(type(generated_text))
        #json_object = json.loads(generated_text)
        fixing_Json(generated_text)
        
        #return generated_text
    except Exception as e:
        print("An error occurred:", str(e))

def fixing_Json(text):
    try:
        json_start = text.find("{")
        json_end = text.rfind("}")
        if json_start !=1 and json_end != -1:
            json_string = text[json_start:json_end+1]
            json_object = json.loads(json_string)
            with open("sample.json", "w") as outfile:
                json.dump(json_object, outfile, indent=4)
            print(json_string)
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
        return run_editor(entered_text)
    elif option == "2":
        print("Selected - 2 | Upload text")
        input_file = select_file()
        input_text = read_file(input_file)
        return run_editor(input_text)
    else:
        print("Invalid Option Selected")

# Run the full pipeline
if __name__ == "__main__":
    selection()

import os, ollama
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
3. Return 1 JSON object listing ALL of the spelling and grammar changes you made to the original text as single words in the format: {{"original": , "corrected"}}
"""

def run_editor(input_text):
    prompt = generate_prompt(input_text)
    model = "llama3.2:latest"
    try:
        response = ollama.generate(model=model, prompt=prompt)
        generated_text = response.get("response", "")
        print(f"Original Text: \n{input_text}\n")
        print(generated_text)
    except Exception as e:
        print("An error occurred:", str(e))

def selection():
    print("Started")
    option = input("Select your input option:\n1-Text Input\n2-File Upload\n")
    if option == "1":
        print("Selected - 1 | Input text")
        entered_text = input("Enter text: ")
        run_editor(entered_text)
    elif option == "2":
        print("Selected - 2 | Upload text")
        input_file = select_file()
        input_text = read_file(input_file)
        run_editor(input_text)
    else:
        print("Invalid Option Selected")

# Run the full pipeline
if __name__ == "__main__":
    selection()

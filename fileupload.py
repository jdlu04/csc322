import ollama
import os

input_file = ""     # Input the absolute file address of the text file

if not os.path.exists(input_file):
    print(f"Input file '{input_file} not found")
    exit(1)

with open(input_file, "r") as f:
    text = f.read().strip()

model = "llama3.2:latest"
prompt = f"""
You are an text editor that corrects only spelling and grammar. 

Here is a text you need to edit: 
{text}

Please: 
1. Correct all spelling and grammar mistakes. Do not change the sentence structure or word choice. 
2. Return 1 JSON object which contains only the corrected text in the format {{"corrected": "your corrected text here"}}
3. Return 1 JSON object listing ALL of the spelling and grammar changes you made to the original text as single words in the format: {{"original" : , "corrected"}}
"""

try:
    response = ollama.generate(model=model, prompt=prompt)
    generated_text = response.get("response", "")
    print("Editted Text\n")
    print(generated_text)
except Exception as e:
    print("An error occurred:", str(e))

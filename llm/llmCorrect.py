## Added for better formatting in LLM endpoints

import json, ollama
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
        return fixing_Json(input_text, generated_text)
    except Exception as e:
        return{"An error occurred:", str(e)}

def fixing_Json(original_text, response_text):
    # Makes a JSON file with both the original & corrected text
    try:
        json_start = response_text.find("{")
        json_end = response_text.rfind("}")
        if json_start !=1 and json_end != -1:
            json_string = response_text[json_start:json_end+1]
            response_object = json.loads(json_string)
            return {
                "original" : original_text,
                "corrected" : response_object.get("corrected", "")
            }
        else:
            return {"Error": "No valid JSON found in LLM response"}
    except Exception as e:
        return {"Error": f"Error extracting JSON: {e}"}
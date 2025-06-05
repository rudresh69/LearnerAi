import os
import google.generativeai as genai
import re

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def get_gemini_response(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text.strip()

def extract_mermaid_code(response: str) -> str:
    if "```mermaid" in response:
        match = re.search(r"```mermaid\s*(.*?)```", response, re.DOTALL)
        return match.group(1).strip() if match else None
    elif "mindmap" in response:
        return response.replace("```", "").replace("mermaid", "").strip()
    return None

def query_gemini(topic: str, map_type: str, text: str = "") -> str:
    if map_type == "text-to-mindmap":
        prompt = f"""
Given the following input text, generate a mermaid mind map code using the mindmap syntax.

### Instructions:
- Use concise and meaningful nodes.
- Keep hierarchy clear and relevant.
- Do not include explanations or comments — only mermaid code.
- Make sure to wrap the output in triple backticks with 'mermaid' after the first three.

### Input Text:
{text}
"""
    elif map_type == "analogy":
        prompt = f"""
Create a mermaid mind map to explain the topic "{topic}" using analogies. Use the mindmap syntax.

### Instructions:
- Use creative and relatable analogies.
- Format output in mermaid mindmap code.
- No explanation, just mermaid code in triple backticks.

Topic: {topic}
"""
    else:
        prompt = f"""
Create a simple mermaid mind map for the topic: "{topic}".

### Instructions:
- Use only mermaid mindmap syntax.
- Keep nodes simple and categorized properly.
- No explanation or text, only mermaid code in triple backticks.
"""

    response = get_gemini_response(prompt)
    code = extract_mermaid_code(response)
    if not code:
        raise ValueError("Failed to extract mermaid code from Gemini response.")
    return code

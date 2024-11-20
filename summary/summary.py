import json
from dotenv import load_dotenv
import os
from openai import OpenAI
from markdown_converter import json_to_markdown

# Load environment variables
load_dotenv("secrets.env")
API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=API_KEY)

def clean_markdown(response_text):
    # Check if the response starts and ends with Markdown-style JSON fences
    if response_text.startswith("```json") and response_text.endswith("```"):
        # Remove the enclosing backticks and json label
        return response_text[7:-3].strip()
    if not response_text.endswith("]"):
        # Add closing square bracket to ensure valid JSON
        response_text += "]"
    return response_text.strip()

def validate_json_syntax(raw_output):
    if ",]" in raw_output or ",}" in raw_output:
        raw_output = raw_output.replace(",]", "]").replace(",}", "}")
    return raw_output

def clean_model_output(response_text):
    response_text = clean_markdown(response_text)
    return response_text

def extract_key_points(text):

    prompt = (
    "Extract key points from the following podcast transcript. For each key point, provide a detailed and engaging summary that follows these guidelines:\n\n"
    
    "1. **Engaging Hook**: Begin each summary with a hook that immediately captures the reader's attention."
    "The hook should end with the special delimiter character '|'. This delimiter must mark where the hook ends and the introduction begins, and it should appear only once in the summary.\n\n"
    "The hook should be a rhetorical question or a thought-provoking statement or joke that entices the reader to continue reading."
    
    "2. **Introduction of Key Point**: After the hook and delimiter, provide a brief introduction to the topic, explaining the main idea in a clear and concise manner. This should naturally follow the hook, setting up the core information.\n\n"
    
    "3. **Creative and Varied Transitions**: Use a variety of transitions to introduce the implications of the topic. Avoid repeating phrases like across summaries. Instead, consider alternatives such as:\n"
    "- 'What does this mean for your everyday life?'\n"
    "- 'Why should you care about this development?'\n"
    "- 'Here’s why this matters right now.'\n"
    "- 'Think about how this could change things for you.'\n"
    "- 'The real question is: what comes next?'\n"
    "Ensure creativity and diversity in transitions to make the summaries more engaging.\n\n"
    
    "4. **Implications and Broader Significance**: After the transition, explain the implications of the topic, including why it matters to the reader and how it impacts the world. Emphasize the practical or real-world effects and provide insights that make the information meaningful.\n\n"
    
    "5. **Grouping by Subject**: Organize points by subjects. Each subject should have its own group in the JSON output, helping to clearly categorize related points and provide a logical structure for the content. Try to minimize the number of groups.\n\n"
    
    "Output the result strictly as raw JSON, using the following structure:\n"
    "[{\"subject\":\"A string representing the main topic or subject of the key points, such as 'Interest Rates' or 'Climate Change'.\",\"points\":[{\"point\":\"A string representing the main idea or title of the key point, providing a brief description.\",\"summary\":\"A detailed explanation of the key point, following the structured format: a rhetorical question hook ending with '|', an introduction to the topic, a creative and varied transition, and an explanation of the implications and broader significance.\"}]}]\n\n"
    
    "### JSON Output Guidelines:\n"
    "- The JSON should contain an array of objects, where each object represents a subject category with a 'subject' key (the topic name) and a 'points' key (an array of key points).\n"
    "- Each key point should be an object with:\n"
    "    - 'point': a brief description of the main idea.\n"
    "    - 'summary': a detailed explanation that follows the structured format specified above.\n\n"
    
    "The summaries should be presented as informative standalone explanations, without referring back to the podcast or assuming the reader has listened to it. "
    "The hook must always end with the delimiter '|', and this character should not appear elsewhere in the summary.\n\n"
    
    "Output only valid JSON without any additional text, explanations, or commentary.\n\n"
    "DO NOT FORGET OPENING AND CLOSING SQUARE BRACKETS FOR THE JSON ARRAY. YOUR OUTPUT SHOULD END WITH A CLOSING SQUARE BRACKET.\n\n"
    "Do not include trailing commas."
    "Ensure JSON is syntactically valid and can be parsed directly."

    "Text to summarize:\n" + text
    )
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
        {
            "role": "system",
            "content": "You are an AI model designed to extract key points and summarize them from podcast transcripts. "
                    "Each key point should be clear and standalone, with a concise summary that provides context."
                    "The summaries should be written like an expert in the field and like a journalist, offering insights and explanations that are both informative and engaging."
                    "Output should be valid JSON that adheres to the user's provided instructions. Do not include any additional text or explanations beyond the JSON data. DO NOT INCLUDE ANY MARKDOWN OR CODE FENCES."
        },
            {"role": "user", "content": prompt},
        ],
    )
    response_text = completion.choices[0].message.content.strip()
    cleaned_json = clean_model_output(response_text)
    cleaned_json = validate_json_syntax(cleaned_json)
    # Attempt to parse the JSON directly
    try:
        parsed_output = json.loads(cleaned_json)
        return parsed_output
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
        print("Raw output:", response_text)
        return None

def clean_delimiter(data):
    for subject in data:
        for point in subject["points"]:
            # Check for multiple delimiters
            if point["summary"].count("|") > 1:
                # Split and rejoin using the first occurrence of "|"
                parts = point["summary"].split("|", 1)
                point["summary"] = f"{parts[0]}| {parts[1]}"
    return data

with open("./transcription.txt", "r") as file:
    podcast_script = file.read()

# Extract key points
print("Extracting key points...")
key_points_json = extract_key_points(podcast_script)
cleaned = clean_delimiter(key_points_json)
markdown = json_to_markdown(cleaned)
print(markdown)
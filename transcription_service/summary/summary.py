import json
import logging
from dotenv import load_dotenv
import os
from openai import OpenAI
from .markdown_converter import json_to_markdown

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Load environment variables
load_dotenv("secrets.env")
API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=API_KEY)

# Configuration
PROMPT_FILE = os.getenv("PROMPT_FILE", "./prompt.txt")
TRANSCRIPTION_FILE = "./transcription.txt"

def load_prompt(file_path):
    """Load the prompt from an external text file."""
    try:
        with open(file_path, "r") as file:
            prompt = file.read()
            logging.info(f"Loaded prompt from {file_path}")
            return prompt
    except FileNotFoundError:
        logging.error(f"Prompt file not found: {file_path}")
        raise
    except Exception as e:
        logging.error(f"Error reading prompt file: {e}")
        raise

def clean_markdown(response_text):
    """Clean and validate markdown-style JSON response."""
    if response_text.startswith("```json") and response_text.endswith("```"):
        return response_text[7:-3].strip()
    if not response_text.endswith("]"):
        response_text += "]"
    return response_text.strip()

def validate_json_syntax(raw_output):
    """Fix common JSON syntax errors."""
    return raw_output.replace(",]", "]").replace(",}", "}")

def clean_model_output(response_text):
    """Clean and validate model output."""
    response_text = clean_markdown(response_text)
    return validate_json_syntax(response_text)

def extract_key_points(text, prompt):
    """Extract key points from the text using OpenAI."""
    logging.info("Sending request to OpenAI API...")
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI model designed to extract key points and summarize them from podcast transcripts. "
                    "Each key point should be clear and standalone, with a concise summary that provides context. "
                    "Output should be valid JSON that adheres to the user's provided instructions. "
                    "DO NOT INCLUDE ANY MARKDOWN OR CODE FENCES."
                ),
            },
            {"role": "user", "content": prompt + "\n\nText to summarize:\n" + text},
        ],
    )
    response_text = completion.choices[0].message.content.strip()
    logging.info("Received response from OpenAI API.")
    
    cleaned_json = clean_model_output(response_text)
    try:
        parsed_output = json.loads(cleaned_json)
        logging.info("Successfully parsed JSON output.")
        return parsed_output
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse JSON: {e}")
        logging.debug(f"Raw output: {response_text}")
        return None

def clean_delimiter(data):
    """Ensure each summary has only one delimiter."""
    for subject in data:
        for point in subject["points"]:
            if point["summary"].count("|") > 1:
                parts = point["summary"].split("|", 1)
                point["summary"] = f"{parts[0]}| {parts[1]}"
    logging.info("Cleaned delimiters in summaries.")
    return data

def read_file(file_path):
    """Read content from a text file."""
    try:
        with open(file_path, "r") as file:
            content = file.read()
            logging.info(f"Loaded file: {file_path}")
            return content
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
        raise
    except Exception as e:
        logging.error(f"Error reading file {file_path}: {e}")
        raise

def main(text=None,file=TRANSCRIPTION_FILE):
    """
    Main function to process the podcast transcription'
    SHOULD NEVER BE CALLED WITH 'text' NONE EXCEPT FOR TESTING
    :param text: The podcast transcription text
    '"""
    try:
        # Load transcription and prompt
        prompt = load_prompt(PROMPT_FILE)
        if not text:
            podcast_script = read_file(file)
        else:
            podcast_script = text

        # Extract key points
        logging.info("Extracting key points from the transcript...")
        key_points_json = extract_key_points(podcast_script, prompt)

        if key_points_json:
            # Clean delimiters and convert to Markdown
            cleaned = clean_delimiter(key_points_json)
            markdown = json_to_markdown(cleaned)
            logging.info("Markdown generation complete.")
            print(markdown)
        else:
            logging.error("Failed to generate key points.")
    except Exception as e:
        logging.error(f"An error occurred: {e}")

if __name__ == "__main__":
    main()

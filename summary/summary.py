import json
from dotenv import load_dotenv
import os
from openai import OpenAI
from markdown_converter import json_to_markdown
import re
# Load environment variables
load_dotenv("secrets.env")
API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=API_KEY)

def clean_model_output(response_text):
    # Check if the response starts and ends with Markdown-style JSON fences
    if response_text.startswith("```json") and response_text.endswith("```"):
        # Remove the enclosing backticks and json label
        return response_text[7:-3].strip()
    return response_text.strip()

def extract_key_points(text):

    prompt = (
        "Extract key points from the following podcast transcript. For each key point, provide a brief summary "
        "that explains it in more detail. Begin each summary with an engaging hook to immediately capture the reader's attention. "
        "Group points by subjects, and output the result strictly as raw JSON with the following structure:"
        "[{\"subject\":\"A string representing the main topic or subject of the key points, such as 'Space Exploration' or 'AI Ethics'.\",\"points\":[{\"point\":\"A string representing the main idea or title of the key point, providing a brief description.\",\"summary\":\"A string providing a detailed explanation of the key point, beginning with an engaging hook to draw the reader in and expanding on the main idea with additional context or insights.\"}]}] "
        "The JSON should contain an array of objects, where each object represents a subject category with a 'subject' key (the topic name) and a 'points' key (an array of key points). "
        "Each key point is an object with a 'point' key (the main idea) and a 'summary' key (a detailed explanation that starts with an engaging hook). "
        "Output only valid JSON without any additional text, explanations, or commentary."
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
        max_completion_tokens=4096
    )
    response_text = completion.choices[0].message.content.strip()
    cleaned_json = clean_model_output(response_text)
    # Attempt to parse the JSON directly
    try:
        parsed_output = json.loads(cleaned_json)
        return parsed_output
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
        print("Raw output:", response_text)
        return None

# Example podcast script
podcast_script = """

Here’s the podcast in plain text form, with topics mixed to test the model's ability to group and identify subjects:

Welcome back to Future Frontiers, where we explore the ideas shaping the world today and tomorrow. Imagine a world where renewable energy powers every aspect of our lives, and carbon emissions are a thing of the past. Scientists are working tirelessly to make this vision a reality through breakthroughs in solar energy, wind power, and carbon capture technologies. But innovation isn’t limited to Earth. Space exploration is entering a new era, driven by partnerships between government agencies like NASA and private companies such as SpaceX. These collaborations are reducing costs and making missions more sustainable, with the Moon and Mars as prime targets.

As AI technologies become more integrated into society, ethical questions are emerging. For instance, how do we ensure fairness in AI-driven hiring systems when historical biases exist in the data? The same AI systems that help doctors detect diseases more accurately could also lead to privacy concerns when dealing with sensitive medical records. On the other hand, AI in space exploration is opening doors. Autonomous robots are conducting research on distant planets, collecting data that was previously inaccessible to humans.

Let’s return to Earth for a moment. Communities around the world are feeling the impacts of climate change. Rising sea levels are threatening coastal cities, while droughts and wildfires are becoming more frequent. The Paris Agreement is a step toward uniting nations against this challenge, but more action is needed. At the same time, private companies are stepping up. Tesla is pushing the boundaries of renewable energy with advancements in electric vehicles and solar power.

The question of how to govern AI development is also pressing. Should governments enforce stricter regulations, or should private companies take the lead? In Europe, policymakers are creating frameworks to regulate high-risk AI applications, such as those used in law enforcement. These efforts aim to balance innovation with accountability. Meanwhile, the push to colonize Mars raises ethical concerns of its own. How do we ensure planetary protection while pursuing our ambitions? And who decides how resources on other planets should be used?

The recent breakthroughs in reusable rocket technology are making it possible to envision regular missions to the Moon. This has reignited discussions about mining lunar resources, such as helium-3, which could potentially revolutionize energy on Earth. But even as we look to the stars, our planet demands attention. Climate justice highlights the fact that those least responsible for emissions are often the most affected by their consequences. Supporting these vulnerable communities must be part of the solution.

AI systems are also shaping industries closer to home. In agriculture, AI-driven technologies are optimizing water usage and increasing crop yields, offering hope in the face of global food insecurity. But at what cost? Automation could displace workers, especially in developing countries. At the same time, advancements in AI-powered robotics are being used to repair satellites in orbit, ensuring that critical communication systems remain operational.

The urgency of climate change cannot be overstated. Without immediate action, ecosystems will continue to collapse, and millions of species could face extinction. Yet, there is hope. Grassroots movements led by young people are demanding accountability from governments and corporations. These activists are using AI tools to analyze environmental data and propose innovative solutions.

As we look ahead, the intersection of AI, space exploration, and climate action shows how interconnected our challenges and opportunities truly are. Whether we’re addressing ethical dilemmas in technology or pushing the boundaries of human capability in space, the choices we make today will shape the future for generations to come.
"""  # Add the full transcript here

# Extract key points
key_points_json = extract_key_points(podcast_script)
markdown = json_to_markdown(key_points_json)
print(markdown)
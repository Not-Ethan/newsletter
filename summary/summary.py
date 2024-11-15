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

# Example podcast script
podcast_script = """
Alright, welcome back to the show, everyone! So, today, we’ve got a lot to cover. Uh, let’s dive right in with, uh, something that’s on everyone’s minds these days: artificial intelligence. You know, AI is, like, evolving so fast, it’s actually kinda hard to keep up. Um, just last week, we saw another breakthrough in generative AI. This one, uh, allows you to create videos from just a simple text prompt. Can you imagine? Like, you type ‘a cat playing the piano in space,’ and boom—there it is. But, uh, with that comes questions about copyright and misuse. Uh, where’s the line between creativity and stealing content? Some, uh, experts argue we need stricter regulations, but honestly, who’s gonna enforce those?
Okay, shifting gears a little here, um, let’s talk about mental health. You know, mental health’s been such a, like, taboo topic for so long, but I feel like, especially after COVID, more people are finally talking about it. Uh, did you know that anxiety levels have gone up by, like, 25% globally since the pandemic started? That’s...that’s massive. And, you know, the systems we have in place, they just—they’re just not enough. Therapy’s expensive, waitlists are ridiculous, and, uh, not everyone even knows how to ask for help. I mean, how do we even begin to tackle something so huge? Maybe tech could help? Like, I read somewhere about these new mental health apps that, uh, use AI chatbots to provide support. But, uh, can a chatbot replace a human therapist? I don’t know, but I guess it’s a step in the right direction.
Alright, so now onto a completely different topic—climate change. Uh, yeah, I know, you’ve probably heard this a million times, but, like, we’re running out of time to act. Did you see that report, uh, from the IPCC last month? They said we’re, like, really close to crossing some of the critical tipping points. Like, you know, the Arctic ice? Yeah, it’s melting way faster than we thought. Uh, and it’s not just about the polar bears—it’s, uh, rising sea levels, extreme weather, and all that stuff. But here’s the thing—some scientists are actually working on, uh, geoengineering projects to, like, reflect sunlight and cool the Earth. Uh, that’s, like, wild, right? But is it safe? What if it has unintended consequences? It’s like playing God or something.
Um, speaking of big ideas, how about space exploration? Like, SpaceX just launched their new Mars-bound rocket prototype last week. Isn’t that insane? Uh, the plan is to send humans to Mars by, like, 2030. But, uh, here’s my question—why are we so focused on Mars when, you know, we’ve got so many problems here on Earth? Like, billions of dollars are being spent on rockets while people here can’t even afford healthcare or clean water. I mean, yeah, sure, exploring space is cool, but, uh, is it really what we should prioritize right now?
Anyway, um, back to technology for a sec, because I forgot to mention something earlier. Uh, so, there’s this big debate about AI replacing jobs. Like, I heard that in, uh, the next ten years, automation could, like, replace 40% of jobs in some sectors. Uh, things like truck driving, customer service, and even some parts of medicine. But, uh, here’s the thing—what happens to all those workers? Are governments even prepared for this shift? Like, are they gonna provide universal basic income or, you know, just, uh, let people fend for themselves? I don’t know—it’s scary to think about.
Oh, oh, before I forget, uh, there’s this cool thing I read about in, uh, renewable energy. Um, so, you know how everyone’s been talking about solar panels and wind turbines? Well, apparently, there’s this new tech that lets you, uh, store renewable energy in giant batteries. Like, these batteries are as big as a shipping container. Isn’t that cool? It could solve one of the biggest problems with renewables, which is, like, storing energy for when the sun’s not shining or the wind’s not blowing. But, uh, the problem is they’re super expensive right now. So, the question is, uh, how do we scale this tech and make it affordable for everyone?
And, um, speaking of affordability, let’s get back to healthcare for a second. Did you know that in the U.S., uh, one in five people can’t afford their prescription medications? Like, how is that even possible in one of the richest countries in the world? Uh, there’s this new push for, like, price caps on drugs, but, uh, pharmaceutical companies are fighting it tooth and nail. I mean, who’s gonna win that battle? It’s, uh, it’s hard to say, but, uh, people are suffering while these companies rake in billions.
Okay, one last thing, uh, before we wrap up today. Let’s talk about education. So, there’s been this, uh, huge debate about whether college is even worth it anymore. Like, student loan debt is at, uh, record levels—over $1.7 trillion in the U.S. alone. And, uh, with the rise of online learning platforms, like, some people are wondering if traditional degrees are becoming obsolete. But here’s the thing—how do employers view online education? Are they gonna treat it the same as a degree from, uh, a top university? I don’t know, but, uh, it’s something to think about.
Alright, uh, that’s all we’ve got for today. Thanks for tuning in, and, uh, we’ll see you next time!
"""

# Extract key points
key_points_json = extract_key_points(podcast_script)
cleaned = clean_delimiter(key_points_json)
markdown = json_to_markdown(cleaned)
print(markdown)
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

def clean_model_output(response_text):
    response_text = clean_markdown(response_text)
    return response_text

def extract_key_points(text):

    prompt = (
    "Extract key points from the following podcast transcript. For each key point, provide a detailed and engaging summary that follows these guidelines:\n\n"
    
    "1. **Engaging Hook**: Begin each summary with a hook that immediately captures the reader's attention. "
    "The hook should end with the special delimiter character '|'. This delimiter must mark where the hook ends and the introduction begins, and it should appear only once in the summary.\n\n"
    
    "2. **Introduction of Key Point**: After the hook and delimiter, provide a brief introduction to the topic, explaining the main idea in a clear and concise manner. This should naturally follow the hook, setting up the core information.\n\n"
    
    "3. **'How Does This Affect You?' Sub-Hook**: Use a secondary question like 'How does this affect you?' to transition into discussing the implications. This question should serve as a 'sub-hook,' introducing the second part of the summary focused on the impact of the topic.\n\n"
    
    "4. **Implications and Broader Significance**: After the sub-hook, explain the implications of the topic, including why it matters to the reader and how it impacts the world. Emphasize the practical or real-world effects and provide insights that make the information meaningful.\n\n"
    
    "5. **Grouping by Subject**: Organize points by subjects. Each subject should have its own group in the JSON output, helping to clearly categorize related points and provide a logical structure for the content. Try to minimize the number of groups.\n\n"
    
    "Output the result strictly as raw JSON, using the following structure:\n"
    "[{\"subject\":\"A string representing the main topic or subject of the key points, such as 'Interest Rates' or 'Climate Change'.\",\"points\":[{\"point\":\"A string representing the main idea or title of the key point, providing a brief description.\",\"summary\":\"A detailed explanation of the key point, following the structured format: a rhetorical question hook ending with '|', an introduction to the topic, a sub-hook ('How does this affect you?'), and an explanation of the implications and broader significance.\"}]}]\n\n"
    
    "### JSON Output Guidelines:\n"
    "- The JSON should contain an array of objects, where each object represents a subject category with a 'subject' key (the topic name) and a 'points' key (an array of key points).\n"
    "- Each key point should be an object with:\n"
    "    - 'point': a brief description of the main idea.\n"
    "    - 'summary': a detailed explanation that follows the structured format specified above.\n\n"
    
    "The summaries should be presented as informative standalone explanations, without referring back to the podcast or assuming the reader has listened to it. "
    "The hook must always end with the delimiter '|', and this character should not appear elsewhere in the summary. If needed, rephrase to avoid using '|' unintentionally.\n\n"
    
    "Output only valid JSON without any additional text, explanations, or commentary.\n\n"
    "DO NOT FORGET OPENING AND CLOSING SQUARE BRACKETS FOR THE JSON ARRAY. YOUR OUTPUT SHOULD END WITH A CLOSING SQUARE BRACKET.\n\n"
    
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
    # Attempt to parse the JSON directly
    try:
        parsed_output = json.loads(cleaned_json)
        return parsed_output
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
        print("Raw output:", response_text)
        return None
def clean_delimiter(data):
    print(data)
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
Host: "Welcome to Economics Uncovered, where we break down the complex world of economics and explore how global events shape our financial future. I’m your host, Rachel Davidson, and today we have a fascinating mix of current economic events and deep economic concepts. With me is Dr. Mark Johnson, a leading economist specializing in international trade and economic policy. Mark, welcome to the show!"
Mark: "Thanks for having me, Rachel. Excited to dive into today’s topics."
Host: "Absolutely. Let’s start with some big news. The recent surge in inflation rates across the globe is causing a lot of concern. In the U.S., inflation has hit a 40-year high. But it’s not just the U.S.; we’re seeing price increases in Europe and parts of Asia as well. Mark, what’s driving this rise in inflation, and what does it mean for the average consumer?"
Mark: "Well, Rachel, there are several factors at play here. First, we’ve seen a post-pandemic supply chain disruption that’s still affecting global trade. Companies are struggling to meet demand, and that’s leading to higher prices. Second, the war in Eastern Europe has exacerbated energy prices, particularly natural gas and oil. This affects everything from transportation costs to heating bills, and it drives up the price of goods across the board."
Host: "It’s interesting you bring up the war in Eastern Europe. Economic sanctions on Russia have undoubtedly disrupted energy markets, but they also have broader implications, don’t they?"
Mark: "Exactly. The sanctions on Russia have not only reduced the supply of oil and gas but have also caused a ripple effect in global commodity markets. Countries that were heavily dependent on Russian exports are scrambling to find alternative sources, which creates competition and drives up prices globally. But we’re also seeing a shift in global trade patterns. For instance, countries like India and China have stepped in to buy discounted Russian energy, which changes the dynamics of global trade."
Host: "That’s a great point. It’s not just about energy, though. You’ve written before about how inflation affects different sectors of the economy differently. Can you elaborate on that?"
Mark: "Sure. Inflation isn’t just about rising prices for consumers; it’s also about shifting economic behavior. For instance, in the housing market, inflation is pushing mortgage rates higher, which is making it more difficult for potential homeowners to afford a home. At the same time, some sectors like technology and renewable energy have seen increased investment because people are looking for ways to hedge against inflation by investing in assets that tend to appreciate over time."
Host: "That’s an interesting dynamic. On the other hand, you have central banks, which are trying to combat inflation by raising interest rates, right?"
Mark: "Yes, central banks, particularly the Federal Reserve, have been raising interest rates in an effort to cool the economy and curb inflation. The theory is that by making borrowing more expensive, consumer spending will slow down, and demand for goods will decrease, which will help bring prices down. But there’s a risk to this, especially in a global economy that’s already recovering from the pandemic. If rates rise too quickly, it could trigger a recession."
Host: "A recession—now that’s a topic that brings a lot of uncertainty. Let’s talk about economic theory for a moment. There’s been a growing debate about whether we’re moving from a market-driven economy to a more interventionist one. What are your thoughts on this shift?"
Mark: "We’re definitely seeing more government intervention, and it's been particularly evident during the pandemic. The U.S. passed trillions in fiscal stimulus to support businesses and consumers. In Europe, countries have implemented similar support packages. The global trend seems to be towards a model where governments are more involved in managing the economy, especially during times of crisis. Some economists argue that this is a necessary step to combat economic inequality and market failures, but others worry that too much intervention can lead to inefficiencies and long-term stagnation."
Host: "That’s a fundamental debate. So, if we look at broader economic theory, we’ve also seen a resurgence of protectionism. Countries are putting up trade barriers, particularly in the wake of COVID and the war. Is this a dangerous trend for global economics?"
Mark: "Protectionism can be a double-edged sword. On one hand, countries are looking to protect domestic industries and jobs, particularly in manufacturing. But on the other hand, protectionism can lead to higher costs for consumers and reduced economic efficiency. The global supply chain has been built on the idea of comparative advantage, where countries specialize in what they do best. If countries start pulling away from this model, it could disrupt global trade and lead to inefficiencies that hurt everyone in the long run."
Host: "So, you’re suggesting that global cooperation is still essential, despite the challenges?"
Mark: "Absolutely. The interconnectedness of the global economy means that cooperation is crucial, not just for trade, but also for tackling global issues like climate change. The recent push for a global carbon tax and international climate agreements shows that despite geopolitical tensions, there’s a recognition that some challenges are too big for any one country to solve alone."
Host: "Speaking of the environment, climate change is not just an environmental issue—it’s becoming a major economic issue too. From carbon pricing to green energy investments, the economy is shifting towards sustainability. How do you see this impacting the global economy in the next decade?"
Mark: "It’s a huge shift. The transition to a greener economy is going to require massive investments in renewable energy, electric vehicles, and sustainable infrastructure. This shift will create new economic opportunities, but it will also require economies to adapt. For countries that are heavily reliant on fossil fuels, the transition might be painful, especially in the short term. But in the long run, the green economy is poised to drive growth and create millions of jobs, particularly in sectors like clean energy and environmental services."
Host: "We’ve touched on so many important topics today, Mark. From inflation to climate change, to the changing role of governments in the economy, it’s clear that the next decade will be pivotal. Any final thoughts?"
Mark: "The next decade will be critical, Rachel. We have a chance to shape the future of the global economy through innovation, collaboration, and smart policy. But it requires us to think beyond short-term profits and focus on long-term sustainability—both for our planet and for our economies."
Host: "Thank you so much, Mark, for your insights today. And thank you to all our listeners for tuning in to Economics Uncovered. Stay tuned as we continue to explore the world of economics and its impact on our lives. Until next time!"
"""  # Add the full transcript here

# Extract key points
key_points_json = extract_key_points(podcast_script)
cleaned = clean_delimiter(key_points_json)
markdown = json_to_markdown(cleaned)
print(markdown)
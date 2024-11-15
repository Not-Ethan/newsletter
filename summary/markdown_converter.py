# Function to convert JSON data as output by the model to Markdown
def json_to_markdown(data):
    markdown_output = []
    for subject in data:
        # Add subject as a Markdown header
        markdown_output.append(f"## {subject['subject']}")
        
        # Add each point and summary under the subject
        for point in subject["points"]:
            # Split the summary into sentences
            sentences = point["summary"].split(". ", 1)
            # Underline the first sentence
            first_sentence = f"<u>{sentences[0]}.</u>" if sentences else ""
            # Add the remaining sentences
            remaining_text = sentences[1] if len(sentences) > 1 else ""
            # Combine the underlined first sentence with the rest of the summary
            markdown_output.append(f"- **{point['point']}**: {first_sentence} {remaining_text}")
        
        # Add a newline for spacing between subjects
        markdown_output.append("")
    
    # Join all lines into a single Markdown string
    return "\n".join(markdown_output)

# Function to convert JSON data as output by the model to Markdown
def json_to_markdown(data):
    markdown_output = []
    for subject in data:
        # Add subject as a Markdown header
        markdown_output.append(f"## {subject['subject']}")
        
        # Add each point and summary under the subject
        for point in subject["points"]:
            # Split the summary into hook and remaining text using the special delimiter
            if "|" in point["summary"]:
                hook, remaining_text = point["summary"].split("|", 1)
                # Underline the hook
                hook = f"<u>{hook.strip()}</u>"
            else:
                hook = ""
                remaining_text = point["summary"]

            # Format the Markdown for the point and summary
            markdown_output.append(f"- **{point['point']}**: {hook} {remaining_text.strip()}")
        
        # Add a newline for spacing between subjects
        markdown_output.append("")
    
    # Join all lines into a single Markdown string
    return "\n".join(markdown_output)

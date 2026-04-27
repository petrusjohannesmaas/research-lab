# /// script
# dependencies = [
#   "regex",
# ]
# ///

import regex
import os

def clean_headings(text):
    lines = text.splitlines()
    cleaned_lines = []

    for line in lines:
        # Check if the line starts with a Markdown heading (one or more #)
        if line.lstrip().startswith('#'):
            # Apply the emoji and trailing space removal only to this line
            line = regex.sub(r'\p{So}\s?', '', line)
        
        cleaned_lines.append(line)

    return "\n".join(cleaned_lines)

def test_single_file(file_path):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        cleaned_content = clean_headings(content)

        test_output = f"CLEANED_{os.path.basename(file_path)}"
        with open(test_output, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        print(f"Test complete. Headings cleaned in: {test_output}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_single_file('posts/YAML_DNS_Server.md')

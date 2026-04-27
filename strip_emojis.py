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
        # Match lines starting with Markdown headings
        if line.lstrip().startswith('#'):
            # Remove emoji and optional trailing space
            line = regex.sub(r'\p{So}\s?', '', line)
        
        cleaned_lines.append(line)

    return "\n".join(cleaned_lines)

def process_all_posts(directory):
    if not os.path.isdir(directory):
        print(f"Error: Directory '{directory}' not found.")
        return

    # Counter for feedback
    files_processed = 0

    for filename in os.listdir(directory):
        if filename.endswith(".md"):
            file_path = os.path.join(directory, filename)
            
            try:
                # Read the original file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Process content
                cleaned_content = clean_headings(content)

                # Write back to the same file (in-place update)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(cleaned_content)
                
                print(f"Updated: {filename}")
                files_processed += 1
            
            except Exception as e:
                print(f"Failed to process {filename}: {e}")

    print(f"\nTask complete. {files_processed} files updated in '{directory}'.")

if __name__ == "__main__":
    # Point this to your 'posts' folder
    process_all_posts('posts')

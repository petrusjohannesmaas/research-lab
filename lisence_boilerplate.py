import os
import re

# Configuration
POSTS_DIR = 'posts'

# Your updated disclaimer
NEW_DISCLAIMER_SECTION = """
## Disclaimer & Intent 

This project was developed for **research and portfolio purposes**. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.
"""

# The license part to keep things professional
LICENSE_SECTION = """
## License
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

### Third-Party Attribution
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.
"""

# Combine them for the final footer
FINAL_FOOTER = f"{NEW_DISCLAIMER_SECTION.strip()}\n\n{LICENSE_SECTION.strip()}"

def update_documentation(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern 1: Matches "Research & Portfolio Intent" blocks
    # Pattern 2: Matches "Disclaimer & Intent" blocks
    # Pattern 3: Matches "License" blocks
    # This ensures we wipe any previous attempts clean before adding the new one
    patterns_to_remove = [
        r'## Research & Portfolio Intent.*?demonstration purposes\.',
        r'## Disclaimer & Intent.*?demonstration purposes\.',
        r'## License.*?licensing terms\.'
    ]

    clean_content = content
    for pattern in patterns_to_remove:
        clean_content = re.sub(pattern, '', clean_content, flags=re.DOTALL | re.IGNORECASE)

    # Clean up whitespace so we don't have massive gaps
    clean_content = clean_content.strip()

    # Append the fresh footer
    final_content = clean_content + "\n\n" + FINAL_FOOTER

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"Refreshed: {file_path}")

def main():
    if not os.path.exists(POSTS_DIR):
        print(f"Directory '{POSTS_DIR}' not found.")
        return

    for root, dirs, files in os.walk(POSTS_DIR):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                try:
                    update_documentation(file_path)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    main()

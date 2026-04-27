import os

# Configuration
POSTS_DIR = 'posts'

def remove_horizontal_rules_safe(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    dash_count = 0
    
    # We only care about '---' at the very start of the line (ignoring whitespace)
    for line in lines:
        stripped = line.strip()
        
        if stripped == '---':
            dash_count += 1
            # Keep the first and second '---' as they define the frontmatter
            if dash_count <= 2:
                new_lines.append(line)
            else:
                # Any '---' after the second one is a horizontal rule; skip it
                continue
        else:
            new_lines.append(line)

    # Write the cleaned content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Cleaned rules (preserved frontmatter): {file_path}")

def main():
    if not os.path.exists(POSTS_DIR):
        print(f"Directory '{POSTS_DIR}' not found.")
        return

    for root, dirs, files in os.walk(POSTS_DIR):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                try:
                    remove_horizontal_rules_safe(file_path)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    main()

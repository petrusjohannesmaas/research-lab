import os
import json

DOCS_DIR = "./docs"
META_FILE = "posts.json"
AUTHOR = "Petrus Johannes Maas"

def add_frontmatter():
    # Load metadata from posts.json
    with open(META_FILE, "r", encoding="utf-8") as f:
        posts = json.load(f)

    for post in posts:
        filename = post.get("filename")
        if not filename:
            print(f"[ERROR] Missing filename in metadata: {post}")
            continue

        md_path = os.path.join(DOCS_DIR, filename)

        if not os.path.exists(md_path):
            print(f"[ERROR] File not found: {md_path}")
            continue

        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Skip if file already has frontmatter
        if content.startswith("---"):
            print(f"[SKIP] {filename} already has frontmatter.")
            continue

        # Build frontmatter block
        frontmatter = (
            "---\n"
            f"title: \"{post['title']}\"\n"
            f"description: \"{post['description']}\"\n"
            f"slug: \"{post['slug']}\"\n"
            f"date: \"{post['date']}\"\n"
            f"tags: {post['tags']}\n"
            f"author: \"{AUTHOR}\"\n"
            "---\n\n"
        )

        # Write updated file
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(frontmatter + content)

        print(f"[OK] Updated {filename} with frontmatter.")

if __name__ == "__main__":
    add_frontmatter()


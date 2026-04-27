---
title: "URL Shortener Service"
description: "Design and implementation of a scalable URL shortening application and redirection logic."
slug: "url-shortener-service"
date: "2026-04-27"
tags: ['Python', 'Flask', 'Backend', 'System Design', 'SQLite']
author: "Petrus Johannes Maas"I
---

# URL Shortening Service

Flask is simple and flexible, perfect for building a RESTful service. Here's how you can implement it using Flask and Python's built-in SQLite library.

## Features

✅ **Create a new short URL** (`POST /shorten`)  
✅ **Retrieve an original URL** (`GET /shorten/<short_code>`)  
✅ **Update an existing short URL** (`PUT /shorten/<short_code>`)  
✅ **Delete an existing short URL** (`DELETE /shorten/<short_code>`)  
✅ **Get statistics on the short URL** (`GET /shorten/<short_code>/stats`)  

## Future Enhancements

- Containerized Deployment instructions
- Authentication  
- Rate Limiting  
- Advanced Analytics  
- gRPC API

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/roadmap.sh/url-shortener.git && cd url-shortener
```

### Development Setup with **uv**

`uv` is an extremely fast Python package and project manager. It replaces `pip`, `venv`, and `pip-tools`.

**Install dependencies and create a virtual environment:**

```bash
uv sync
```

**Run the application:**

```bash
uv run main.py
```

## Running as a Tool with **uv**

Instead of traditional installation methods, `uv` allows you to run the project in an isolated environment with a single command.

### Project Structure

```
url_shortener/
│── main.py         # (Your Flask app)
│── pyproject.toml  # (Project metadata and dependencies)
│── README.md
```

### Install the Project

If you want to install the project as a globally accessible tool on your system:

```bash
uv tool install .
```

Now you can run it from anywhere:

```bash
url-shortener
```

**Uninstall it with:**

```bash
uv tool uninstall url-shortener
```

### Quick Run (Without Installation)

You can also run the script directly while automatically handling dependencies defined in the `pyproject.toml`:

```bash
uv run python main.py
```

Your API will be available at **[http://127.0.0.1:5000/shorten](http://127.0.0.1:5000/shorten)** 🎉

## Disclaimer & Intent 

This project was developed for **research and portfolio purposes**. The primary goal is to explore architectural patterns and software systems. It is provided for educational and demonstration purposes.

## License
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the License at:
[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Third-Party Attribution
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.

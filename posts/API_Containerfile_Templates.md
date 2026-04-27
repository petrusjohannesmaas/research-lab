---
title: "API Containerfile Templates"
description: "A collection of optimized Containerfile templates specifically designed for containerizing various API frameworks."
slug: "api-containerfile-templates"
date: "2024-01-15"
tags: ['Docker', 'API', 'DevOps']
author: "Petrus Johannes Maas"
---

# API Containerfile Templates

## Overview

A collection of starter API servers, packaged as Docker templates for:

* **Python (Flask)**
* **JavaScript (Express.js)**
* **Go (net/http)**

These templates offer a simple yet powerful starting point for building and deploying backend APIs using **Docker** or **Podman**.

> 💡 **Tip:** Podman can be used as a drop-in replacement for Docker. Just swap `docker` with `podman`—they both follow the [OCI standards](https://opencontainers.org/).

## Image Versions

Choose from stable or long-term support (LTS) versions when customizing your `Containerfile`.

### Python

| Version  | Notes                             |
| -------- | --------------------------------- |
| `3.13.3` | Latest Stable (April 2025)        |
| `3.11`   | LTS (Sec. updates until Oct 2027) |
| `3.14`   | Upcoming (Oct 2025)               |

### Go

| Version  | Notes                    |
| -------- | ------------------------ |
| `1.24.3` | Latest Stable (May 2025) |
| `1.24.0` | Major Release (Feb 2025) |

### Node.js

| Version | Notes                   |
| ------- | ----------------------- |
| `21.x`  | Latest Stable           |
| `20.x`  | LTS                     |
| `22.x`  | Upcoming LTS (Oct 2025) |

> ✅ **Recommended:** Use LTS versions for stability in production environments.

## Clone the Repository

```bash
git clone https://github.com/petrusjohannesmaas/api-containerfile-templates.git
cd api-containerfile-templates
```

## ️ Building the Containers (Docker images)

### Flask (Python)

```bash
docker build -t flask-api -f Containerfile .
```

### Express (JavaScript)

```bash
docker build -t express-api -f Containerfile .
```

### Go (net/http)

```bash
docker build -t go-api -f Containerfile .
```

## ️ Running the Containers

### Flask (Port `5000`)

```bash
docker run -d -p 5000:5000 flask-api
```

### Express (Port `3000`)

```bash
docker run -d -p 3000:3000 express-api
```

### Go (Port `8080`)

```bash
docker run -d -p 8080:8080 go-api
```

## Testing the APIs

Use `curl` or open in your browser:

```bash
curl http://localhost:5000/  # Flask
curl http://localhost:3000/  # Express
curl http://localhost:8080/  # Go
```

Or visit:

* [http://localhost:5000](http://localhost:5000) – Flask
* [http://localhost:3000](http://localhost:3000) – Express
* [http://localhost:8080](http://localhost:8080) – Go

## Pushing to Docker Hub

To share your image publicly:

### 1. Log in to Docker Hub

```bash
docker login
```

### 2. Tag your image

```bash
docker tag flask-api yourusername/flask-api:latest
```

### 3. Push the image

```bash
docker push yourusername/flask-api:latest
```

Repeat the steps for other images (`express-api`, `go-api`) as needed.

> 📝 Replace `yourusername` with your Docker Hub username.

## Managing Containers

```bash
docker ps                # List active containers
docker stop <container>  # Stop container
docker rm <container>    # Remove container
```

## Future Enhancements

* Add more language templates (e.g., Rust, Java)
* Add support for **Docker Compose**
* Add support for **Kubernetes** deployment files
* Improve Go template to support third-party packages

## Disclaimer & Intent 

This project was developed for **research and portfolio purposes**. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

## License
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

### Third-Party Attribution
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.
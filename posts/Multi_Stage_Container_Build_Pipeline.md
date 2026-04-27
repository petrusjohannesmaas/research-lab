---
title: "Multi Stage Container Build Pipeline"
description: "Optimizing Docker images using multi-stage builds to reduce production image sizes."
slug: "multi-stage-container-build-pipeline"
date: "2026-01-07"
tags: ['Docker', 'DevOps', 'Optimization']
author: "Petrus Johannes Maas"
---

# **Project: Multi-Stage Container Build Pipeline**  
### **Overview**
This project focuses on **optimizing Docker/Podman container builds** using **multi-stage builds** to reduce image size and improve efficiency. The pipeline automates the **build, test, and deployment** process, making it ideal for production-ready applications.


## **Objectives**
✔️ **Implement multi-stage builds** to reduce final image size  
✔️ **Optimize layer caching** for faster rebuilds  
✔️ **Automate container builds & deployments** using **GitHub Actions / CI/CD**  
✔️ **Secure the image** with minimal attack surface  
✔️ **Test containerized apps efficiently**  


## **Technology Stack**
✅ **Podman or Docker** (Container runtime)  
✅ **GitHub Actions / GitLab CI/CD** (Build Automation)  
✅ **Dockerfile multi-stage builds** (Optimized layering)  
✅ **Kubernetes / Local Deployment** (Application runtime)  
✅ **Trivy / DockerScout** (Security scanning)  


## **Project Steps**
### **1️⃣ Set Up Multi-Stage Dockerfile**
Instead of **including everything in one image**, use **multi-stage builds** to create a **small, optimized production image**.

📄 **Dockerfile**
```dockerfile
# Build Stage
FROM golang:1.20 AS build
WORKDIR /app
COPY . .
RUN go build -o myapp

# Final, Minimal Runtime Stage
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/myapp .
CMD ["./myapp"]
```
✅ First stage **builds the app**  
✅ Second stage **copies only the final binary**, reducing image size  


### **2️⃣ Automate CI/CD with GitHub Actions**
Create a **CI/CD workflow** to automatically **build, test, and push images**.

📄 **`.github/workflows/container-build.yml`**
```yaml
name: Build & Push Container

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Build Docker Image
        run: docker build -t myapp:latest .

      - name: Run Tests
        run: docker run --rm myapp:latest go test ./...

      - name: Push Image
        run: docker tag myapp:latest myregistry.com/myapp:latest && docker push myregistry.com/myapp:latest
```
✅ **Automatically builds & tests** on every push  
✅ **Pushes optimized image to container registry**  


### **3️⃣ Optimize Layer Caching**
Use **layer caching** to speed up builds:

```dockerfile
# Start with dependencies
FROM node:18 AS build
WORKDIR /app
COPY package.json .
RUN npm install

# Copy source after dependencies are cached
COPY . .
RUN npm run build
```
✅ **Dependency layers remain cached**  
✅ **Source changes don’t invalidate package installs**  


### **4️⃣ Integrate Security Scanning**
Run **Trivy** or **DockerScout** to scan images for vulnerabilities:

```yaml
- name: Scan for vulnerabilities
  run: trivy image myapp:latest
```
✅ Ensures **secure builds** with minimal vulnerabilities  


### **5️⃣ Deploy Optimized Image**
Use **Kubernetes or Podman Compose** to **run the image efficiently**.

📄 **`docker-compose.yml`**
```yaml
version: '3'
services:
  app:
    image: myregistry.com/myapp:latest
    ports:
      - "8080:8080"
```
✅ Automatically **runs updated container**  


## **Final Outcome**
By the end of this project, you'll have:
✔️ **A fully optimized container build pipeline**  
✔️ **Automated CI/CD deployments with GitHub Actions**  
✔️ **Security scanning & rollback mechanisms**  
✔️ **Minimal-sized images using multi-stage builds**

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
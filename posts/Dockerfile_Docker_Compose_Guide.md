---
title: "Dockerfile and Docker Compose Guide"
description: "A technical guide for creating and configuring Dockerfiles and docker-compose files for containerized applications."
slug: "dockerfile-docker-compose-guide"
date: "2026-04-30"
tags: ['Docker', 'Containers', 'DevOps', 'Infrastructure']
author: "Petrus Johannes Maas"
---

# Dockerfile and Docker Compose Guide

## Overview
A `Dockerfile` defines the instructions required to build a single container image. It specifies the base operating system, installs dependencies, copies application code, and sets the execution command. A `docker-compose.yml` file orchestrates multiple containers as a unified application stack. It defines service relationships, configures networks, manages persistent volumes, and handles startup dependencies. Use a Dockerfile to construct an image; use docker-compose to deploy and manage multi-container environments.

## Creating a Dockerfile
A Dockerfile executes sequentially from top to bottom. Each instruction generates a cached layer. Optimize build speed and image size by ordering instructions from least to most frequently changed.

### Example: Node.js API
```dockerfile
FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Example explained:

1. Create a file named `Dockerfile` in the project root.
2. Specify the base image using `FROM`. Use official, slim, or alpine variants when possible.
3. Set the working directory using `WORKDIR`. This avoids manual directory creation and path errors.
4. Copy dependency manifests (e.g., `package.json`, `requirements.txt`) before copying source code. Run the package manager to install dependencies. This preserves the dependency layer cache.
5. Copy the remaining application files using `COPY`.
6. Declare the network port using `EXPOSE`. This documents the port but does not publish it.
7. Define the startup command using `CMD` or `ENTRYPOINT`. Use exec form (`["executable", "arg"]`) to ensure proper signal handling.


## Creating a docker-compose File
Compose files use YAML syntax. Docker Compose V2 is the default and does not require a `version` field at the root.

### Example: Multi-Service Stack
```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secure_password
    restart: unless-stopped

volumes:
  pgdata:
```

### Example explained:

1. Create a file named `docker-compose.yml` in the project root.
2. Define application components under the `services` key. Each service maps to a container.
3. Specify how the service is sourced. Use `build: .` to reference a local Dockerfile, or `image: <name>` to pull a pre-built image.
4. Map host ports to container ports using the `ports` directive (`"host:container"`).
5. Mount directories or named volumes using `volumes`. Use bind mounts (`./app:/usr/src/app`) for development and named volumes for production data.
6. Inject configuration using `environment` or reference an `.env` file.
7. Define service dependencies using `depends_on` to control startup order.


## Execution Commands
Manage the container lifecycle using the Docker CLI. Compose V2 uses `docker compose` (no hyphen).

```bash
# Build and start services in detached mode
docker compose up -d --build

# View real-time logs for all services
docker compose logs -f

# Stop and remove containers, networks, and volumes
docker compose down -v
```

**Disclaimer & Intent**:
This project was developed for research and portfolio purposes. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

**License**:
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)
Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

**Third-Party Attribution**:
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.

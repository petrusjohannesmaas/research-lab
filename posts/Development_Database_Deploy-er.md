---
title: "Development Database Deployer"
description: "Automated scripts for deploying and seeding databases in local and staging development environments."
slug: "development-database-deployer"
date: "2024-08-14"
tags: ['Database', 'SQL', 'Automation']
author: "Petrus Johannes Maas"
---

# Development Database Deploy-er

## Overview

This script allows users to deploy database containers dynamically with customizable names, ports, and environment variables. It currently supports **MongoDB**, **PostgreSQL**, and **MariaDB** using Docker. This is not intended for use in production; I mainly use it for development.

**Note:** This script uses Docker commands to run containers based on Open Container Initiative (OCI) standards. Docker images and container formats are widely supported, meaning the script should work consistently across environments that support OCI-compliant containers.

## Features

* Select a database to deploy: **MongoDB, PostgreSQL, or MariaDB**
* Customize container name and port number
* Provide credentials for PostgreSQL and MariaDB
* Secure password input handling
* Simple, interactive command-line interface

Additionally, you can modify the script to deploy databases from your preferred repository by simply changing the image URL used in the `docker run` commands. This flexibility allows you to use custom-built images or alternative sources.

## Usage

**⚠️ Make sure Docker is installed on your system**:

```bash
sudo apt install docker.io
docker --version
```

1. Clone the repository:

   ```bash
   git clone https://github.com/petrusjohannesmaas/dev-database-deployer
   cd dev-database-deployer
   ```

2. Make the script executable:

   ```bash
   chmod +x dev-db-deploy.sh
   ```

3. Run the script:

   ```bash
   ./dev-db-deploy.sh
   ```

4. Follow the interactive prompts to deploy the desired database container.

## Future improvements

* **Enhanced Error Handling**: Improve robustness and gracefully manage exceptions.
* **Expanded Database Support**: Add Redis support for key-value storage.
* **Additional Configuration Options**: Provide users with more environment variables for fine-tuned deployments.

## Troubleshooting with Docker

If you encounter issues while deploying database containers with Docker, here are some common problems and solutions:

### 1️⃣ **Docker Command Not Found**

**Issue:** Running `docker` results in a "command not found" error.
**Solution:** Ensure Docker is installed properly:

```bash
sudo apt install docker.io   # Debian/Ubuntu
sudo dnf install docker      # Fedora
sudo yum install docker      # CentOS
brew install docker          # macOS (Homebrew)
```

Verify installation with:

```bash
docker --version
```

### 2️⃣ **Containers Not Starting**

**Issue:** After running the script, containers fail to start.
**Solution:** Check container logs and status:

```bash
docker ps -a  # View all containers
docker logs <container_name>  # Check logs of a specific container
```

Ensure the correct image is pulled by running:

```bash
docker images
```

If needed, try pulling the latest version:

```bash
docker pull mongo
```

### 3️⃣ **Port Conflicts**

**Issue:** The port you specified is already in use.
**Solution:** Find active processes using the port:

```bash
sudo netstat -tulnp | grep <port_number>
```

If necessary, use a different port or stop the conflicting service.

### 4️⃣ **Docker Permission Denied**

**Issue:** Running Docker commands results in a permission error.

**Solution:** Add your user to the Docker group:

```bash
sudo usermod -aG docker $USER
```

Then log out and back in, or run:

```bash
newgrp docker
```

---

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
---
title: "YAML DNS Server"
description: "Configuring DNS records and server settings using structured YAML definitions."
slug: "yaml-dns-server"
date: "2026-04-22"
tags: ['Networking', 'DNS', 'YAML']
author: "Petrus Johannes Maas"
---

# YAML DNS Server

## 🌐 Overview

A local DNS server using Go and YAML configuration. It’s containerized with Docker Compose for streamlined setup.

✔ **Custom hostname-to-IP mappings via YAML**  
✔ **Lightweight Go-based DNS resolution**  
✔ **Fully containerized for easy deployment**  
✔ **Configurable via Docker Compose**

This offers a simple way to update manage user friendly **IP -> Hostname** mappings for accessing and interacting with services on your network. 

> ⚠️ **Warning:** You should not use this project for production purposes. It is intended for learning and development purposes only.

## 📂 Clone the Repository

```bash
git clone https://github.com/petrusjohannesmaas/yaml-dns-server.git
cd yaml-dns-server
```

## 🏗️ Building the image (Docker)

```bash
docker build -t yaml-dns-server .
```

### Run with Docker Compose

```bash
docker compose up -d
```

## 🔍 Test DNS Resolution

Use `dig` or `nslookup` to verify DNS functionality:

```bash
dig @localhost dev-machine.local
```
```bash
nslookup dev-machine.local localhost
```


## 🔧 Configuration

Modify `dns_records.yml` to update hostname mappings:

```yaml
records:
  - hostname: "dev-machine.local"
    ip: "192.168.0.xxx"
  - hostname: "server.local"
    ip: "192.168.0.xxx"
```

> 📝 Run `docker compose down` and `docker compose up` when making changes.

## 🧰 Managing Containers

```bash
docker ps                # List active containers
docker stop <container>  # Stop container
docker rm <container>    # Remove container
```

## 📈 Future Enhancements

* **Troubleshooting**: Include troubleshooting steps in the README.
* **Front end configuration**: Add a web interface for easy hostname management.
* **Automatic reloads**: Ensure new records apply **without restarting** the server.
* **Logging**: Capture query analytics.
* **Security**: Add authentication for managing DNS entries.
* **Persistent storage**: Mount `dns_records.yaml` so records survive container restarts.
* **Caching**: Implement a caching mechanism to improve performance.

## **License**
This project is licensed under the **GNU GENERAL PUBLIC LICENSE Version 3**. See the [LICENSE](LICENSE) file for details.
---
title: "Caching Proxy"
description: "Implementation details for setting up a caching proxy to improve web performance and reduce origin load."
slug: "caching-proxy"
date: "2024-05-18"
tags: ['Networking', 'Performance', 'Proxy']
author: "Petrus Johannes Maas"
---

# Caching Proxy

## 📡 Overview

A caching server built with Go. It forwards requests to an origin server, caches responses, and improves performance on repeated requests.

* **Efficient response caching (using LRU cache)**
* **Fast performance using Go's concurrency**
* **Easy to extend for more advanced caching and request handling**
* **Compiles to binary**

> 💡 **Prerequisites:** Make sure you have Go installed on your machine if you want to recompile the binary.

## 🧠 How It Works

| Command                    | Description                      |
| -------------------------- | -------------------------------- |
| `./caching-proxy --port 3000 --origin http://dummyjson.com`   | Starts the Proxy      |
| `./caching-proxy --clear-cache` | Manually clear the cache |

### Send a request to:

```
http://localhost:3000/products
```

You should receive the response from the origin and subsequent requests will hit the cache.

### Clone the Repository

```sh
git clone https://github.com/petrusjohannesmaas/roadmap.sh
cd caching-proxy
```

### Install Dependencies

Use the Go package manager to install the required external package:

```sh
go get github.com/hashicorp/golang-lru
```

### Build the Project

```sh
go build -o caching-proxy proxy.go
```

This will compile a binary named `caching-proxy` in the project folder.

## 📦 Recommended Libraries

Consider these packages to enhance or optimize your proxy:

| Package                                                 | Description                                   |
| ------------------------------------------------------- | --------------------------------------------- |
| [`fasthttp`](https://github.com/valyala/fasthttp)       | High-performance HTTP server/client           |
| [`golang-lru`](https://github.com/hashicorp/golang-lru) | Simple and efficient LRU cache implementation |
| [`fiber`](https://github.com/gofiber/fiber)             | Express.js-style web framework for Go         |

## 📈 Future Enhancements

* Add TTL-based cache expiration
* Improve logging & error handling
* Support more HTTP methods (e.g., POST, PUT)
* Persist cache to disk between restarts
* Secure endpoint for manual cache invalidation

## 📄 License

MIT License © [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

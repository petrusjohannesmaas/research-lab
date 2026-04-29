---
title: "Basic Dockerfile"
description: "An introductory look at creating essential Dockerfiles for standard application environments."
slug: "basic-dockerfile"
date: "2024-03-22"
tags: ['Docker', 'Containers', 'Beginner']
author: "Petrus Johannes Maas"
---

# Basic Dockerfile Project

This project contains a simple Dockerfile that, when built and run, outputs “Hello, Captain!” with the active user and the date to the console.

**Prerequisites:**
Ensure you have Docker installed on your machine. You can download and install Docker from [here](https://docs.docker.com/get-started/get-docker/):

### Instructions

Clone my `roadmap.sh` repository (if applicable):

```sh
git clone https://github.com/petrusjohannesmaas/roadmap.sh.git
cd basic-dockerfile
```

### Build the Docker image:

Run the following command to build the Docker image using the Dockerfile in the root directory:

```sh
docker build -t hello-captain .
```

After building the image, you can run (and delete) the container using:
```sh
docker run --rm hello-captain
```

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

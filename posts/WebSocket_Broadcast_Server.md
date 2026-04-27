---
title: "WebSocket Broadcast Server"
description: "Building a server capable of broadcasting real-time messages to multiple connected clients."
slug: "websocket-broadcast-server"
date: "2026-04-18"
tags: ['WebSockets', 'Real-time', 'NodeJS']
author: "Petrus Johannes Maas"
---

# WebSocket Broadcast Server
**🖱️ Link to GitHub project:** [Click here](https://github.com/petrusjohannesmaas/websocket-broadcast-server)

## Overview

A simple CLI-based WebSocket broadcast server built with Node.js. This tool lets you:

* **Start a WebSocket server**
* **Connect multiple interactive clients via terminal**
* **Broadcast messages between connected clients in real-time**
* **Gracefully handle disconnections with `Ctrl+C`**

> 💡 **Prerequisites:** Make sure you have Node.js installed on your machine.

## How It Works

| Command                    | Description                      |
| -------------------------- | -------------------------------- |
| `broadcast-server start`   | Starts the WebSocket server      |
| `broadcast-server connect` | Connects a terminal-based client |

All clients connect to the server and send messages that are broadcast to all other connected clients.

### Clone the Repository

```bash
git clone https://github.com/petrusjohannesmaas/websocket-broadcast-server
cd websocket-broadcast-server
```

### Install Dependencies

```bash
npm install
```

### Create an Alias

```bash
vim ~/.bashrc
```

This will let you run `broadcast-server` globally from anywhere.

## Usage

**Start the WebSocket Server:**

```bash
broadcast-server start
```

* Starts the server on `ws://localhost:8080`
* Logs client connections and broadcasts

**Connect Clients:**

Run these commands in separate terminals to simulate multiple clients.

```bash
broadcast-server connect
```

* Prompts for a nickname
* Lets you send messages interactively
* Messages are broadcast to all other connected clients

## Graceful Shutdown

* Press `Ctrl+C` in any terminal to disconnect
* Server will notify all clients and close connections

## Example Session

**Terminal A:**

```bash
broadcast-server start
# Output: Broadcast server running at ws://localhost:8080
```

**Terminal B:**

```bash
broadcast-server connect
Enter your nickname: Alice
Alice> Hello!
```

**Terminal C:**

```bash
broadcast-server connect
Enter your nickname: Bob
Bob> Hey Alice!
# Terminal B sees: Received: Bob: Hey Alice!
```

## Future Enhancements

* Add command line options (`--port`, `--nickname`)
* Add secure WebSocket (`wss://`) support
* Add user authentication
* Add message history or logging
* Convert to TypeScript
* Migrate to Deno from Node
* gRPC or GraphQL API

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
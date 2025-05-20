# 📡 WebSocket Broadcast App with Podman (Node.js + ws)

This guide walks you through:

* Building a WebSocket broadcast server
* Connecting CLI clients
* Containerizing both server and client with **Podman**
* Running everything using **Podman Compose**

---

## ✅ Prerequisites

* Node.js & npm (for testing)
* Podman
* Podman Compose (`dnf install podman-compose` or `pip install podman-compose`)

---

## 📁 Project Structure

```
broadcast-app/
│
├── server/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│
├── client/
│   ├── client.js
│   ├── package.json
│   ├── Dockerfile
│
└── podman-compose.yml
```

---

## 🛠️ Step 1: Create Server Script

**`server/server.js`**

```js
#!/usr/bin/env node

const WebSocket = require("ws");

const args = process.argv.slice(2);
const command = args[0];
const port = 8080;

if (command !== "start") {
    console.error("Usage: broadcast-server start");
    process.exit(1);
}

const wss = new WebSocket.Server({ port });
console.log(`Broadcast server running at ws://localhost:${port}`);

wss.on("connection", (ws) => {
    console.log("Client connected.");
    ws.on("message", (message) => {
        console.log(`Broadcasting: ${message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
    ws.on("close", () => console.log("Client disconnected."));
});
```

---

## 🧑‍💻 Step 2: Create Client Script

**`client/client.js`**

```js
#!/usr/bin/env node

const WebSocket = require("ws");
const readline = require("readline");

const args = process.argv.slice(2);
const command = args[0];
const serverUrl = "ws://server:8080";

if (command !== "connect") {
    console.error("Usage: broadcast-server connect");
    process.exit(1);
}

const ws = new WebSocket(serverUrl);

ws.on("open", () => {
    console.log(`Connected to ${serverUrl}`);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.setPrompt("Message: ");
    rl.prompt();

    rl.on("line", (msg) => {
        ws.send(msg);
        rl.prompt();
    });
});

ws.on("message", (data) => console.log(`Received: ${data}`));
ws.on("close", () => {
    console.log("Disconnected.");
    process.exit(0);
});
```

---

## 📦 Step 3: Add `package.json` Files

**`server/package.json`**

```json
{
  "name": "broadcast-server",
  "version": "1.0.0",
  "dependencies": {
    "ws": "^8.0.0"
  }
}
```

**`client/package.json`**

```json
{
  "name": "broadcast-client",
  "version": "1.0.0",
  "dependencies": {
    "ws": "^8.0.0"
  }
}
```

---

## 🐳 Step 4: Podman Dockerfiles

**`server/Dockerfile`**

```Dockerfile
FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY server.js .
EXPOSE 8080
CMD ["node", "server.js", "start"]
```

**`client/Dockerfile`**

```Dockerfile
FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY client.js .
CMD ["node", "client.js", "connect"]
```

---

## 🧩 Step 5: Podman Compose File

**`podman-compose.yml`**

```yaml
version: "3"
services:
  server:
    build: ./server
    ports:
      - "8080:8080"

  client:
    build: ./client
    depends_on:
      - server
    stdin_open: true
    tty: true
```

---

## 🚀 Step 6: Run with Podman

From the `broadcast-app/` directory:

### Build and Start Services:

```sh
podman-compose up --build -d
```

### Run Client Interactively:

```sh
podman-compose run client
```

Run this command multiple times in different terminals to simulate multiple clients.

---

## 🛑 Step 7: Stop Everything

```sh
podman-compose down
```

To clean up unused images:

```sh
podman image prune -a
```

---

## ✨ Future Enhancements

* Add a `stop` command to gracefully shut down the server
* Add nicknames/usernames for messages
* Add support for connecting to remote WebSocket servers
* Add authentication and reconnection logic

---
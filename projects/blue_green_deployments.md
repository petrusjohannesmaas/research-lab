# Blue-Green Deployments with GitHub Actions

## ✅ **Overview**

* **App**: Go app returning JSON with version name (v1 or v2).
* **Environment**: Podman (instead of Docker), running on a Debian 12.10 server.
* **CI/CD**: GitHub Actions deploys new versions using Blue-Green deployment strategy.

---

## 🗂️ **Directory Structure**

```bash
blue-green-deploy/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── app/
│   └── main.go
├── Dockerfile
└── README.md
```

---

## 🧱 Step 1: Simple Go App (v1)

Create `app/main.go`:

```go
package main

import (
    "encoding/json"
    "net/http"
)

type Version struct {
    Version string `json:"version"`
}

func handler(w http.ResponseWriter, r *http.Request) {
    v := Version{Version: "v1"}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(v)
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

---

## 🐳 Step 2: Dockerfile for Podman

```Dockerfile
FROM golang:1.21 as builder

WORKDIR /app
COPY app/ .

RUN go build -o server main.go

FROM debian:12-slim

COPY --from=builder /app/server /usr/local/bin/server

EXPOSE 8080

CMD ["server"]
```

---

## 🔄 Step 3: Blue-Green Strategy

We'll deploy to two containers: `app-blue` and `app-green`. Only one is "live" via a reverse proxy (e.g., Caddy or Nginx). On deployment, the new version is deployed to the inactive container, tested, and traffic is switched.

> We'll script this with `podman` commands via GitHub Actions.

---

## 🐙 Step 4: GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Blue-Green Deployment

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Podman
        run: |
          sudo apt-get update
          sudo apt-get -y install podman

      - name: Build and push image
        run: |
          export IMAGE_TAG=app:$(date +%s)
          podman build -t $IMAGE_TAG .
          podman save $IMAGE_TAG -o image.tar

      - name: Copy image to remote server
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          source: "image.tar"
          target: "~/"

      - name: Deploy on remote server
        uses: appleboy/ssh-action@v0.1.6
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            set -e
            podman load -i image.tar
            IMAGE=$(podman load -i image.tar | awk '{print $NF}')
            
            # Determine which container is running
            ACTIVE=$(podman ps --format "{{.Names}}" | grep app-blue || true)
            if [ -n "$ACTIVE" ]; then
              TARGET=green
            else
              TARGET=blue
            fi

            # Stop old target
            podman rm -f app-$TARGET || true

            # Run new version
            podman run -d --name app-$TARGET -p 8081:8080 $IMAGE

            # Simple health check
            sleep 5
            curl -f http://localhost:8081 || (echo "Health check failed" && podman rm -f app-$TARGET && exit 1)

            # Swap traffic (assuming nginx or Caddy switches proxy to 8081)
            ln -sf /etc/nginx/sites-available/app-$TARGET.conf /etc/nginx/sites-enabled/default
            systemctl reload nginx

            # Remove old container
            if [ "$TARGET" = "green" ]; then
              podman rm -f app-blue
            else
              podman rm -f app-green
            fi
```

---

## 🔐 Step 5: GitHub Secrets

Set the following in your repo under **Settings > Secrets**:

* `SERVER_IP`
* `SERVER_USER`
* `SERVER_SSH_KEY` (private key with access to the server)

---

## 📡 Step 6: Reverse Proxy Configuration (Nginx)

On your server, set up two configs:

### `/etc/nginx/sites-available/app-blue.conf`

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://localhost:8080;
    }
}
```

### `/etc/nginx/sites-available/app-green.conf`

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://localhost:8081;
    }
}
```

Link the active one to `/etc/nginx/sites-enabled/default`.

```bash
sudo ln -sf /etc/nginx/sites-available/app-blue.conf /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

---

## 🚀 Deployment Flow

1. You push code to GitHub.
2. GitHub Actions builds the Podman image.
3. Image is SCP’d to your Debian server.
4. Remote script:

   * Deploys new version to inactive container.
   * Health-checks the new version.
   * Switches Nginx config.
   * Removes the old version.

---

## ✅ Verify

After pushing, visit your server IP. You should see JSON like:

```json
{ "version": "v1" }
```

Change to v2 later and repeat the flow.

---

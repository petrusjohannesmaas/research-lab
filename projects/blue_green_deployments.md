# Blue-Green Deployments

### Overview

Blue green deployment is an application release model that gradually transfers user traffic from a previous version of an app or microservice to a nearly identical new release—both of which are running in production. 

The old version can be called the blue environment while the new version can be known as the green environment. Once production traffic is fully transferred from blue to green, blue can standby in case of rollback or pulled from production and updated to become the template upon which the next update is made.

You can do this in multiple ways. We'll look at a simple approach using native Kubernetes resources, then we'll look at a more advanced approach using GitHub Actions.

#### ✅ Prerequisites

* A Kubernetes cluster (e.g., Kind, Minikube, or managed)
* `kubectl` installed
* Docker installed locally and on your GitHub Actions runner (built-in)
* Docker Hub account or another container registry


## Native Kubernetes Resources
First, we'll achieve a Blue-Green deployment using native Kubernetes resources namely **Deployments** and **Services**.

### 🏗 Images for deployment

We'll need 2 images to deploy: one for the **blue** version and one for the **green** version.

```Dockerfile
FROM alpine:latest

RUN apk add --no-cache nmap-ncat && \
    echo -e '#!/bin/sh\necho -e "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"version\": 1}" | ncat -l -p 8000 --keep-open' > /server.sh && \
    chmod +x /server.sh

CMD ["/server.sh"]
```

Build your image with a version tag (e.g., `v1.0`):
   ```sh
   docker build -t myapp:v1.0 .
   ```

### **Pushing to Docker Hub**
To simulate production workflows, we'll push to an image registry.

1. **Log in to Docker Hub**:
   ```sh
   docker login
   ```
2. **Tag your image for Docker Hub**:
   ```sh
   docker tag myapp:v1.0 YOUR_DOCKER_USERNAME/myapp:v1.0
   ```
3. **Push it**:
   ```sh
   docker push YOUR_DOCKER_USERNAME/myapp:v1.0
   ```

🔁 To make the second image, update the **Dockerfile** to say `{"version": 2}` instead of `{"version": 1}` and repeat the process.



## **🛫 Implementing the deployment**

Start by creating a folder for your deployment in your project directory:
```bash
mkdir blue-green-deploy
```

### **1. Create the Blue Version**
Add a deployment for your "stable" version (`blue`) of the application.

`blue-deployment.yaml`:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blue-myapp
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
      replica: blue
  template:
    metadata:
      labels:
        app: myapp
        replica: blue
    spec:
      containers:
        - name: myapp
          image: YOUR_DOCKER_USERNAME/myapp:v1.0
          ports:
            - name: http
              containerPort: 8000
          startupProbe:
            tcpSocket:
              port: 8000
            initialDelaySeconds: 20
            periodSeconds: 5
```

### **2. Create a Service for Blue**
Add a service to route traffic to the **blue** deployment. *(We're going to update this later)*

`service.yaml`:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: default
spec:
  selector:
    app: myapp
    replica: blue
  ports:
    - protocol: TCP
      port: 8000
      targetPort: http
```

### **3. Create the Green Version**
Add the **green** version (`new release`) to the folder.

`green-deployment.yaml`:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: green-myapp
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
      replica: green
  template:
    metadata:
      labels:
        app: myapp
        replica: green
    spec:
      containers:
        - name: myapp
          image: YOUR_DOCKER_USERNAME/myapp:v2.0
          ports:
            - name: http
              containerPort: 8000
          startupProbe:
            tcpSocket:
              port: 8000
            initialDelaySeconds: 20
            periodSeconds: 5
```

Deploy everything to the cluster:
```bash
kubectl apply -f blue-green-deploy/
```



You can test this in a second terminal by running a `curl` command:

```bash
kubectl run curl --image=alpine/curl:8.2.1 -n kube-system -i --tty --rm -- sh
```

Kubernetes has a built-in CoreDNS service for resolving pod and service names inside the cluster. Run this loop in the pod:

```bash
for i in `seq 1 1000`; do curl myapp.default:8000/; echo ""; sleep 1; done
```

You should see only `{"version": "v1"}` in the output.

### **4. Switch Traffic to Green**
Once the **green** version is tested and ready, update the **Service** to point to `replica: green`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: default
spec:
  selector:
    app: myapp
    replica: blue
  ports:
    - protocol: TCP
      port: 8000
      targetPort: http
```

Deploy the change:
```bash
kubectl apply -f service.yaml
```

You should see the version change from `v1` to `v2`.

### **5. Rollback if Needed**
If something goes wrong, simply update the **Service** back to `version: blue`.

This method keeps things simple—no need for GitHub Actions or complex automation! You can also use **Ingress** for more advanced traffic routing.



---

## 🐙 GitHub Actions Blue-Green Workflow

Now let’s automate deployment using GitHub Actions and Docker.

---

### 🗂️ Directory Structure

```bash
blue-green-deploy/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── app/
│   └── main.go
├── Dockerfile
├── manifests/
│   ├── blue-deployment.yaml
│   ├── green-deployment.yaml
│   └── service.yaml
└── README.md
```

---

### 🧱 Step 1: Simple Go App

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
    v := Version{Version: "v2"}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(v)
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

---

### 🐳 Step 2: Dockerfile

```Dockerfile
FROM golang:1.21 as builder

WORKDIR /app
COPY app/ .
RUN go build -o server main.go

FROM alpine:latest
COPY --from=builder /app/server /usr/local/bin/server

EXPOSE 8080
CMD ["server"]
```

---

## 🐙 Step 3: GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Blue-Green Deployment

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    env:
      IMAGE_NAME: yourdockerhubusername/myapp

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image
        run: |
          VERSION=$(date +%s)
          docker build -t $IMAGE_NAME:$VERSION .
          docker push $IMAGE_NAME:$VERSION
          echo "IMAGE_TAG=$IMAGE_NAME:$VERSION" >> $GITHUB_ENV

      - name: Set up Kubeconfig
        run: |
          mkdir -p ~/.kube
          echo "${{ secrets.KUBECONFIG }}" > ~/.kube/config

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/green-myapp myapp=${{ env.IMAGE_TAG }} || \
          kubectl apply -f manifests/green-deployment.yaml

      - name: Run Health Check
        run: |
          sleep 10
          STATUS=$(kubectl get pods -l replica=green -o jsonpath="{.items[*].status.containerStatuses[*].ready}")
          if [[ "$STATUS" != "true" ]]; then
            echo "Green deployment failed health check"
            exit 1
          fi

      - name: Switch Service to Green
        run: |
          sed -i 's/replica: blue/replica: green/' manifests/service.yaml
          kubectl apply -f manifests/service.yaml
```

---

### 🔐 GitHub Secrets to Add

Add these under **Settings → Secrets and variables → Actions**:

| Name                 | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username                                   |
| `DOCKERHUB_TOKEN`    | Docker Hub access token                                    |
| `KUBECONFIG`         | Base64-encoded kubeconfig file (or raw config as a secret) |

---

## 🔁 Optional Rollback

To roll back traffic to Blue:

```bash
sed -i 's/replica: green/replica: blue/' manifests/service.yaml
kubectl apply -f manifests/service.yaml
```

---

## 📦 What This Workflow Does

1. Builds a Docker image of your Go app.
2. Tags it with the current timestamp.
3. Pushes it to Docker Hub.
4. Updates the Kubernetes **green deployment** to the new image.
5. Runs a basic health check on the pod.
6. If successful, it switches the service to point to `replica: green`.

---

## ✅ Summary

| Area      | Tech Used                          |
| --------- | ---------------------------------- |
| Language  | Go (HTTP server returning version) |
| Container | Docker                             |
| Infra     | Kubernetes (Deployments + Service) |
| CI/CD     | GitHub Actions                     |
| Registry  | Docker Hub                         |


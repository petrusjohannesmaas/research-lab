# **Rolling Deployments with Kubernetes (K3s)**
### **Objective**
Set up a **rolling deployment** in **K3s** where an API continuously updates its version while ensuring zero downtime. This guide includes:
- Setting up a **K3s Cluster**
- Deploying an **API container**
- Implementing **Blue-Green Deployments**
- Automating updates via **GitHub Actions**
- Using a **private container registry within K3s**

## **Prerequisites**
✅ Two VMs running K3s  
✅ GitHub repository for automation  
✅ SSH access to the K3s node  
✅ Basic knowledge of Docker and Kubernetes  
✅ Helm (optional) for advanced deployment management  

---

## **Step 1: Install K3s on Your Nodes**
On **each VM**, install K3s (single-node setup for simplicity):
```sh
curl -sfL https://get.k3s.io | sh -
```
Confirm installation:
```sh
kubectl get nodes
```

For multi-node clusters:
```sh
curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -
```

---

## **Step 2: Create a Private Container Registry in K3s**
To **store container images locally**, deploy a **registry** inside K3s.

### **Deploy Registry in a New Namespace**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: registry

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registry
  namespace: registry
spec:
  replicas: 1
  selector:
    matchLabels:
      app: registry
  template:
    metadata:
      labels:
        app: registry
    spec:
      containers:
        - name: registry
          image: registry:2
          ports:
            - containerPort: 5000
```

### **Expose the Registry as a Service**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: registry-service
  namespace: registry
spec:
  selector:
    app: registry
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
```

### **Push an Image to Your Registry**
```sh
docker tag api-container localhost:5000/api:v1
docker push localhost:5000/api:v1
```

---

## **Step 3: Deploy API with Rolling Updates**
Now deploy a **simple API** returning its version via Kubernetes.

### **Kubernetes Deployment for API**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api-container
          image: localhost:5000/api:v1
          ports:
            - containerPort: 8080
```

### **Service to Expose API**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: LoadBalancer
```

Apply configurations:
```sh
kubectl apply -f api-deployment.yml
kubectl apply -f api-service.yml
```

---

## **Step 4: Automate Rolling Deployments Using GitHub Actions**
### **Set Up SSH Access in GitHub Secrets**
Store:
- `SSH_HOST` → Your K3s Node IP  
- `SSH_USER` → Username  
- `SSH_PRIVATE_KEY` → SSH Key  

### **GitHub Action Workflow**
```yaml
name: Deploy Rolling Update

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Build and Push Image
        run: |
          docker build -t localhost:5000/api:v${{ github.run_number }} .
          docker push localhost:5000/api:v${{ github.run_number }}

      - name: SSH into K3s node and deploy update
        uses: appleboy/ssh-action@v0.1.6
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            kubectl set image deployment/api api-container=localhost:5000/api:v${{ github.run_number }}
```

---

## **Step 5: Monitor Rolling Updates**
Check status of rolling update:
```sh
kubectl rollout status deployment/api
```

Roll back if needed:
```sh
kubectl rollout undo deployment/api
```

Verify pod versions:
```sh
kubectl get pods -o wide
```
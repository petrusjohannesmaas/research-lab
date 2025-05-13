# Rolling Deployments with Kubernetes
### Objective
This project was inspired by a video from [Anton Putra](https://www.youtube.com/watch?v=lxc4EXZOOvE) where he showcases different deployment strategies in Kubernetes. I want to learn how a **rolling deployment** works.

**References:**
* Official Minikube documentation: [click here](https://minikube.sigs.k8s.io/docs/)
* CNCF Distribution Registry: [click here](https://distribution.github.io/distribution/)
* Anton Putra's Github repository for the video: [click here](https://github.com/antonputra/tutorials/tree/main/lessons/171)

**The steps will include:**

- Setting up a `minikube` development cluster
- Hosting a **local container registry**
- Building, tagging and storing 2 versions of a **Golang API**
- Deploying an **API** (v1) on Kubernetes
- Monitoring and applying a Rolling Deployment (v2)

**Future improvements:**

* TODO: Configure the registry to be password protected + TLS. Reference: [FreeCodeCamp](https://www.freecodecamp.org/news/how-to-self-host-a-container-registry/)
* TODO: Add a Github Actions CI/CD workflow to work with the v1 and v2 of the **API**
* TODO: Add load balancing instead of node ports for the deployment

## Stage 1: Setting up a `minikube` development cluster

I am running a Debian system and I got many errors when trying to use `podman` as my driver in rootless mode. I used the default `apt` repository when I installed Podman, which is a bit outdated, and will cause possible issues with your `minikube start` command. I didn't want to install Docker with root privileges, so I used Homebrew to install and manage the needed dependencies.

Make sure you have `git` installed, then run the Homebrew installation script and follow the rest of the installation instructions:

```sh
git --version
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Make sure Homebrew is ready to go:

```sh
brew update
brew doctor
```

Now let's check all `minikube` package dependencies:

```
brew info minikube
```

You can install everything by running this command:

```sh
brew install go go-bindata minikube
```

Start your cluster. By default, it's going to run with the VirtualBox driver:

```sh
minikube start
```

The `minikube` package automatically install the `kubernetes-cli` (kubectl) package. Confirm the cluster is running:

```sh
kubectl get nodes
```

## **Stage 2: Hosting a Local Container Registry**

Create a namespace for organizational purposes:

```sh
kubectl create namespace local-registry
kubectl get namespace
```

Create a deployment for the registry by creating a file called `registry.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registry
  namespace: local-registry
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
---
apiVersion: v1
kind: Service
metadata:
  name: registry-service
  namespace: local-registry
spec:
  type: NodePort
  selector:
    app: registry  # Correct structure for selector
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
      nodePort: 30500
```

### **Making the Registry Accessible**
In order to push to the cluster from our development environment, we have to **set up an ingress**, which is a bit outside the scope of this tutorial. Instead, I've implemented a simple **NodePort** for testing purposes in the `Service` section of the deployment.

Deploy the local container registry by running this command:

```sh
kubectl apply -f registry.yaml
```

Let's see everything running in the namespace:

```sh
kubectl get all -n local-registry
```

### **Extending with PVC for Persistence**
To extend your **registry deployment** with a **Persistent Volume Claim (PVC)** for data persistence, follow these steps:

#### **1️⃣ Define a Persistent Volume Claim (`registry-pvc.yaml`)**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: registry-pvc
  namespace: local-registry
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

#### **2️⃣ Modify the Deployment to Mount the PVC**

Extend your **`registry.yaml`**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registry
  namespace: local-registry
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
          volumeMounts:
            - name: registry-storage
              mountPath: /var/lib/registry
      volumes:
        - name: registry-storage
          persistentVolumeClaim:
            claimName: registry-pvc
```

#### **3️⃣ Apply the Configuration**

```sh
kubectl apply -f registry-pvc.yaml
kubectl apply -f registry.yaml
```

This ensures that the **registry's stored images persist** across restarts instead of being wiped when the pod is deleted.

## **Stage 3: Create, build and store 2 versions of an API**

I used my **ECR-API-Templates** repository for a basic Go HTTP server. Clone the repository:

```sh
git clone https://github.com/petrusjohannesmaas/ECR-API-Templates
cd ECR-API-Templates/go
```

In the **/api** folder update the `server.go` file:

```go
package main

import (
    "encoding/json"
    "net/http"
)

type Response struct {
    Response string `json:"response"`
}

func handler(w http.ResponseWriter, r *http.Request) {
    res := Response{Response: "🎉 Version 1 is running"}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(res)
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

Build the image using the `Containerfile` in the `/go` template folder:

```sh
podman build -t test-go-api -f Containerfile .
```

If you try to push to the registry, **Podman is expecting HTTPS**, but the **local registry is running over HTTP**. You have two options to resolve this.

#### **Option 1: Allow Insecure Registry in Podman**

I needed the following dependency on top of my Debian installation to make Podman push to an insecure registry:

```sh
sudo apt install uidmap
```

Also, if you're running Podman in rootless mode like me, instead of modifying the system-wide `/etc/containers/registries.conf`, create a per-user configuration:

```sh
mkdir -p $HOME/.config/containers
vi $HOME/.config/containers/registries.conf
```

Add this to the file:

```sh
[[registry]]
location="<NODE_IP>:30500"
insecure=true
```

#### **Option 2: Use HTTPS with Self-Signed Certificates**

If you'd rather **secure the registry**, you can:
1. Generate a self-signed certificate.
2. Configure `registry.yaml` to use it.
3. Push over HTTPS.

Now, we can go back to building the images.
#### **1️⃣ Tag and push (V1) to the registry**

```sh
podman tag test-go-api <NODE_IP>:30500/test-go-api:v1
podman push <NODE_IP>:30500/test-go-api:v1
```

Verify it exists in the registry:

```sh
curl -X GET http://<NODE_IP>:30500/v2/_catalog
```

⛳ **Pro tip:** If you want to keep the `ECR-API-Templates` clean, just roll back the changes in your Git source code management tool after pushing the image.

#### **2️⃣ Modify `server.go` for (V2)**

```go
func handler(w http.ResponseWriter, r *http.Request) {
    res := Response{Response: "🚀 Version 2 is running"}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(res)
}
```

Rebuild the image:

```sh
podman build -t test-go-api -f Containerfile .
```

Tag + push the updated image:

```sh
podman tag test-go-api <NODE_IP>:30500/test-go-api:v2
podman push <NODE_IP>:30500/test-go-api:v2
```

Verify both versions exist:

```sh
curl -X GET http://<NODE_IP>:30500/v2/test-go-api/tags/list
```

Now, you're ready to implement rolling updates in Kubernetes using **V1 → V2**  

## **Stage 4: Deploy API on Kubernetes**

Now we can finally deploy **V1** of our API on our Kubernetes cluster.

### **Kubernetes Deployment for API**

Create a namespace for the deployment:

```sh
kubectl create namespace testing
kubectl get namespace
```

Create a file called `api-deployment.yaml`:

⚠️ **Notes:** 
* We specify **"localhost"** instead of the node IP because the registry is running on this cluster.
* Usually you would use a **LoadBalancer** service object, but we'll just use a simple **NodePort** again for testing purposes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: testing
spec:
  replicas: 4
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
          image: localhost:30500/test-go-api:v1
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: testing
spec:
  type: NodePort
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 30080
```

**Apply the Deployment**

```sh
kubectl apply -f api-deployment.yml
```

Verify that the pods and services are running:

```sh
kubectl get all -n testing
```

Check the API response using:

```sh
curl http://<NODE-IP>:30080
```

This should return:
```sh
{"response":"🎉 Version 1 is running"}
```

If you want to delete everything in the namespace:

```sh
kubectl delete all --all -n testing
```

## **Stage 5: Monitoring  + Applying a Rolling Deployment**

Create a file called `rolling-update.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: testing
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
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
          image: localhost:30500/test-go-api:v2
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: testing
spec:
  type: NodePort
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 30080
```

### 

Open a second terminal and run:

```sh
watch -n 0.5 kubectl get all -n testing
```

This will refresh the namespace status every 0.5 seconds.

**Apply the rolling update:**

```sh
kubectl apply -f rolling-update.yaml
```

Check the API response using:

```sh
curl http://<NODE-IP>:30080
```

This should return:

```sh
{"response":"🚀 Version 2 is running"}
```

🥳 **Congrats, your API has been successfully updated with 0 downtime!**

---

### ☣️ Housekeeping

**Be careful if you are using Podman or `minikube` for other projects!**

To get rid of the cluster:

```sh
minikube delete
```

If you no longer need this registry configuration, simply delete the file:
```sh
rm -f $HOME/.config/containers/registries.conf
```

I like to completely purge my Podman after testing:
```
podman system reset
```


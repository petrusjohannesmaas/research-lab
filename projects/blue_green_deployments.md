# Blue-Green Deployments

### Overview

Blue green deployment is an application release model that gradually transfers user traffic from a previous version of an app or microservice to a nearly identical new release—both of which are running in production. 

The old version can be called the blue environment while the new version can be known as the green environment. Once production traffic is fully transferred from blue to green, blue can standby in case of rollback or pulled from production and updated to become the template upon which the next update is made.

You can do this in multiple ways. We'll look at a simple approach using native Kubernetes resources, then in the future we'll look at a different approach using GitHub Actions.

#### ✅ Prerequisites

* A Kubernetes cluster (e.g., Kind, Minikube, or managed)
* `kubectl` installed
* Docker installed locally and on your GitHub Actions runner (built-in)
* Docker Hub account or another container registry


## Native Kubernetes Resources
To achieve a Blue-Green deployment in Kubernetes we can use native Kubernetes resources namely **Deployments** and **Services**.

### 🏗 Images for deployment

We'll need 2 images to deploy: one for the **blue** version and one for the **green** version.

Create a loop in `server.sh` with an HTTP response:
```bash
#!/bin/sh
while true; do
  {
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"version\": \"1\"}"
  } | nc -l -p 8000
done
```

```Dockerfile
FROM busybox:latest

COPY server.sh /server.sh
RUN chmod +x /server.sh

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

🔁 To make the second image, update the **server.sh** to say `{"version": 2}` instead of `{"version": 1}` and repeat the process.



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
    replica: green
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

When you're done, get rid of the deployments and services:

```bash
kubectl delete deployment green-myapp
kubectl delete deployment blue-myapp
kubectl delete service myapp
```

---

### Next steps:

* Implement CI/CD workflow
* Implement a **blue-green deployment** using GitHub Actions.
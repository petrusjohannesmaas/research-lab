# Blue-Green Deployment with GitHub Actions

## **Basic concepts**
Blue-Green deployment ensures **zero-downtime updates** by maintaining two versions of your application:
- **Blue** → The live version currently serving traffic.
- **Green** → The new version being deployed.
- Once **Green** is verified as stable, traffic switches from **Blue** to **Green**.
- If any issues arise, traffic rolls back to **Blue** instantly.

To achieve this, we will:

✅ **Preconfigure the VM** → Set up an OCI-compliant **image repository** before deployment.  
✅ **Configure SSH** → Make sure GitHub has access to our VM
✅ **Define GitHub Actions first** → Configure **automation before committing any code**.  
✅ **Deploy applications in Podman** → Containerize and automate API versions.  
✅ **Use NGINX for traffic switching** → Dynamically route requests.  
✅ **Implement rollback** → Restore Blue if Green fails.  
✅ **Add logging & monitoring** → Track deployments for debugging.

---

## **1. Preparing the VM with an Image Repository**
Before deployment, we need a **local container registry** to store images.

### **Step 1: Install Podman**
```bash
sudo apt update && sudo apt install podman -y
```
Verify installation:
```bash
podman --version
```

### **Step 2: Run a Local Image Registry**
```bash
podman run -d -p 5000:5000 --name registry registry:2
```
✅ **Your VM now hosts a private registry at** `192.168.56.101:5000`

### **Step 3: Ensure Podman Can Push Images**
On your **host machine**, tag and push images to the VM registry:
```bash
podman tag my-api:v1 192.168.56.101:5000/my-api:v1
podman push 192.168.56.101:5000/my-api:v1
```

---

## **2. Define GitHub Actions Before Committing Code**
Create `.github/workflows/deploy.yml` to automate deployments **before writing any code**.

```yaml
name: Deploy API with NGINX Blue-Green

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v3

    - name: SSH into VM & Pull Latest Image
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /your/deployment/path
          podman pull 192.168.56.101:5000/my-api:v${{ github.run_number }}
          podman run -d --name api-green -p 8081:80 192.168.56.101:5000/my-api:v${{ github.run_number }}

    - name: Update NGINX to Switch Traffic
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          sudo sed -i 's/server blue .*/server blue 127.0.0.1:8080 backup/' /etc/nginx/nginx.conf
          sudo sed -i 's/server green .*/server green 127.0.0.1:8081/' /etc/nginx/nginx.conf
          sudo systemctl restart nginx
```

✅ **Prepares automation before code commits**.

---

## **3. Write & Containerize API Versions**
After defining GitHub Actions, develop and package the API.

### **Step 1: Version 1 API (`server.go`)**
```go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    response := `{"response": "This is version 1 of the API"}`
    fmt.Fprintln(w, response)
}

func main() {
    http.HandleFunc("/", handler)
    fmt.Println("Version 1 API running on port 8080")
    http.ListenAndServe(":8080", nil)
}
```

### **Step 2: Containerfile**
```Dockerfile
FROM golang:latest
WORKDIR /app
COPY server.go .
RUN go build -o server
CMD ["./server"]
EXPOSE 8080
```

✅ **Test Locally**
```bash
podman build -t my-api:v1 .
podman run -d --name api-blue -p 8080:80 my-api:v1
```

✅ **Push to Local Registry**
```bash
podman tag my-api:v1 192.168.56.101:5000/my-api:v1
podman push 192.168.56.101:5000/my-api:v1
```

✅ **Commit & Push Code**
```bash
git add .
git commit -m "Initial version 1"
git push origin main
```

GitHub Actions **automatically detects the push**, pulls the image, and deploys it via NGINX 🎉.

---

## **4. Configure NGINX for Traffic Switching**
Your **NGINX configuration file** should look like this:

```nginx
http {
    upstream blue {
        server 127.0.0.1:8080;  # Blue (Version 1) API
    }

    upstream green {
        server 127.0.0.1:8081;  # Green (Version 2) API
    }

    server {
        listen 80;

        location / {
            proxy_pass http://blue;  # Default to Blue (version 1)
            proxy_set_header Host $host;
        }
    }
}
```

Once **Green** is deployed, GitHub Actions updates `nginx.conf` to switch traffic.

✅ **Start NGINX on the VM**
```bash
sudo systemctl restart nginx
```

---

## **5. Write & Push Version 2**
Update `server.go` for **Version 2**:
```go
func handler(w http.ResponseWriter, r *http.Request) {
    response := `{"response": "This is version 2 of the API"}`
    fmt.Fprintln(w, response)
}
```

✅ **Rebuild & Push Version 2**
```bash
podman build -t my-api:v2 .
podman tag my-api:v2 192.168.56.101:5000/my-api:v2
podman push 192.168.56.101:5000/my-api:v2
```

✅ **Commit & Push**
```bash
git add .
git commit -m "Version 2 update"
git push origin main
```

---

## **6. Implement Rollback & Logging**
If **Green fails**, GitHub Actions rolls back traffic to Blue.

### **Rollback Step**
```yaml
- name: Rollback to Blue (Version 1)
  if: failure()
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      sudo sed -i 's/server green .*/server green 127.0.0.1:8080 backup/' /etc/nginx/nginx.conf
      sudo sed -i 's/server blue .*/server blue 127.0.0.1:8080/' /etc/nginx/nginx.conf
      sudo systemctl restart nginx
```

### **Basic Logging for API**
```go
import "log"

func handler(w http.ResponseWriter, r *http.Request) {
    log.Println("Received request at", r.URL.Path)
    response := `{"response": "This is version 1 of the API"}`
    fmt.Fprintln(w, response)
}
```

✅ **NGINX rollback ensures stability**.  
✅ **Logging captures API requests**.

---

## **Final System Overview**
🚀 **VM runs an OCI-compliant registry for image storage**  
🚀 **GitHub Actions automates image pulling and deployment**  
🚀 **NGINX dynamically switches traffic between Blue & Green**  
🚀 **Rollback restores Blue if Green fails**  
🚀 **Logging enables monitoring of API requests**  
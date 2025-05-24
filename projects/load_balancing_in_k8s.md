# **Load Balancing in Kubernetes**
  
Kind (Kubernetes IN Docker) allows you to run Kubernetes clusters locally. This guide helps configure load balancing using **MetalLB** in a Kind setup.  We'll use Caddy to reverse proxy to our MetalLB-assigned services so that we can access them via a browser on other devices on the network without using NodePorts.

## **Prerequisites**  
Ensure the following dependencies are installed:  
- [Git](https://git-scm.com/)  
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)  
- [Go](https://go.dev/) (1.18+)  
- [Docker](https://docs.docker.com/)  

---

## **1️⃣ Install Dependencies**  

### **Install Go**  
```bash
sudo snap install --classic go
```

### **Install kubectl**  
```bash
sudo snap install kubectl --classic
```

### **Install Git**  
```bash
sudo apt install git
```

### **Install Docker**  
```bash
sudo apt update
sudo apt install ca-certificates curl  
sudo install -m 0755 -d /etc/apt/keyrings  
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc  
sudo chmod a+r /etc/apt/keyrings/docker.asc  

echo "deb [signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null  
sudo apt update  
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin  
```

**Manage permissions:**  
```bash
sudo groupadd docker  
sudo usermod -aG docker $USER  
newgrp docker  # Apply changes immediately  
```

---

## **2️⃣ Install Kind**  
```bash
go install sigs.k8s.io/kind@v0.29.0
```

### **Verify Installation**  
Check where Go binaries are stored:  
```bash
echo $(go env GOPATH)/bin
```

If `kind` isn't found, add it to your `PATH`:  
```bash
export PATH=$(go env GOPATH)/bin:$PATH  
echo 'export PATH=$(go env GOPATH)/bin:$PATH' >> ~/.bashrc  
source ~/.bashrc  
```

Check Kind version:  
```bash
kind version
```

---

## **3️⃣ Create Kind Cluster with MetalLB Support**  
Define your cluster configuration in `kind-config.yaml`:  
```yaml
kind: Cluster  
apiVersion: kind.x-k8s.io/v1alpha4  
nodes:  
- role: control-plane  
  extraPortMappings:  
  - containerPort: 80  
    hostPort: 80  
  - containerPort: 443  
    hostPort: 443  
networking:  
  disableDefaultCNI: true  
```

Create the cluster:  
```bash
kind create cluster --config kind-config.yaml
```

---

## **4️⃣ Install a CNI (Calico)**  
Since we disabled the default CNI, install **Calico** for networking:  
```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml  
kubectl get pods -n kube-system  # Verify installation  
```

---

## **5️⃣ Install MetalLB**  
```bash
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.10/config/manifests/metallb-native.yaml  
kubectl get pods -n metallb-system  # Verify status  
```

---

## **6️⃣ Configure MetalLB IP Pool**  
Find your Kind Docker network subnet:  
```bash
docker network inspect kind | grep "Subnet"
```

Select an IP range (e.g., `172.18.255.200-172.18.255.250`) and create a `metallb-config.yaml`:  
```yaml
apiVersion: metallb.io/v1beta1  
kind: IPAddressPool  
metadata:  
  name: kind-pool  
  namespace: metallb-system  
spec:  
  addresses:  
  - 172.18.255.200-172.18.255.250  
---  
apiVersion: metallb.io/v1beta1  
kind: L2Advertisement  
metadata:  
  name: l2adv  
  namespace: metallb-system  
```

Apply the configuration:  
```bash
kubectl apply -f metallb-config.yaml
```

---

## **7️⃣ Deploy a LoadBalancer Service**  
Test MetalLB with an Nginx deployment:  
```bash
kubectl create deployment nginx --image=nginx  
kubectl expose deployment nginx --port=80 --type=LoadBalancer  
kubectl get svc nginx  # Check assigned IP  
```

Access the service via the external IP using a browser or `curl`.

---

## **8️⃣ Troubleshooting**  
💡 **No EXTERNAL-IP?**  
Check MetalLB logs:  
```bash
kubectl logs -n metallb-system deploy/controller  
```
Ensure your subnet range matches Kind's Docker network.  

💡 **Can't reach service via IP?**  
- Check port mappings in Kind config.  
- Verify network settings via:  
  ```bash
  docker inspect kind  
  ```

---

## **9️⃣ Reverse Proxy with Caddy**  
Use **Caddy** inside Docker to proxy traffic to MetalLB-assigned services.  

### **Setup Caddy**  
Create a directory:  
```bash
mkdir -p ~/caddy && cd ~/caddy
```

Create a `Caddyfile`:  
```Caddyfile
:8080 {  
    reverse_proxy 172.18.255.200  
}
```

Create a **Docker volume**:  
```bash
docker volume create caddy_data  
```

### **Docker Compose Configuration (`docker-compose.yml`)**  
```yaml
services:  
  caddy:  
    image: caddy:2  
    container_name: caddy-reverse-proxy  
    ports:  
      - "8080:8080"  
    volumes:  
      - ./Caddyfile:/etc/caddy/Caddyfile  
      - caddy_data:/data  
    networks:  
      - kind  

volumes:  
  caddy_data:  

networks:  
  kind:  
    external: true  
```

Start Caddy:  
```bash
docker compose up -d  
```

Access via: `http://<SERVER-IP>:8080`  

---

## **🔹 Optional: Multiple Services**  
Modify `Caddyfile` to proxy multiple services:  
```Caddyfile
http://192.168.1.100:8080 {  
    reverse_proxy 172.18.255.200  
}  

http://192.168.1.100:8081 {  
    reverse_proxy 172.18.255.201  
}  
```

Update `docker-compose.yml` to map multiple ports.

---

### **Future Enhancements**  
✅ HTTPS with Caddy  
✅ Integrate Caddy into Kind  
✅ Automate cluster setup with Helm  
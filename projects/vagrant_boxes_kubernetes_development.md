# Vagrant Boxes Kubernetes Development

I'm aiming to encapsulate my whole load-balanced Kubernetes setup with Kind, MetalLB, and Caddy inside a Vagrant VM using a script. We'll need to:

1. **Use the `alvistack/ubuntu-25.04` Vagrant box**.
2. **Create a Vagrantfile** that sets up the VM with a proper IP (so the host can access services).
3. **Write `install-kind.sh`** that automates everything in your documentation (with required adjustments for a VM).
4. Ensure **IP configuration** works for MetalLB and Caddy to serve content back to the host browser.


I go through the steps to set this up in full detail in my [Load Balancing in Kubernetes](https://github.com/petrusjohannesmaas/research-lab/tree/main/projects/load_balancing_in_k8s) project.

---

### ✅ Step 1: Vagrantfile (with static IP for host access)

We'll configure the VM with a static IP like `192.168.56.10`:

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "alvistack/ubuntu-25.04"

  # Set a private network IP so host can reach VM services
  config.vm.network "private_network", ip: "192.168.56.10"

  # Forward docker HTTP/HTTPS if you ever need
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 443, host: 8443

  # Shared folder (optional)
  config.vm.synced_folder ".", "/vagrant", disabled: true

  # Provision with shell script
  config.vm.provision "shell", path: "install-kind.sh"
end
```

---

### ✅ Step 2: `install-kind.sh` (your documentation converted)

Here’s a first version that automates everything and adjusts the IPs for a Vagrant VM environment:

```bash
#!/bin/bash
set -e

echo "[+] Updating system..."
sudo apt update

echo "[+] Installing Git, Curl, CA Certs..."
sudo apt install -y git curl ca-certificates

echo "[+] Installing Go (Snap)..."
sudo snap install go --classic

echo "[+] Installing kubectl (Snap)..."
sudo snap install kubectl --classic

echo "[+] Installing Docker..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "[+] Configuring Docker permissions..."
sudo groupadd docker || true
sudo usermod -aG docker vagrant
newgrp docker <<EONG

echo "[+] Installing Kind..."
export PATH=$PATH:$(go env GOPATH)/bin
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> /home/vagrant/.bashrc
go install sigs.k8s.io/kind@v0.29.0

echo "[+] Creating Kind cluster config..."
cat <<EOF > /home/vagrant/kind-config.yaml
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
EOF

echo "[+] Creating Kind cluster..."
kind create cluster --config /home/vagrant/kind-config.yaml

echo "[+] Installing Calico..."
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
sleep 30  # Allow time for pods to initialize

echo "[+] Installing MetalLB..."
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.10/config/manifests/metallb-native.yaml

echo "[+] Configuring MetalLB IP Pool..."
# Use a MetalLB IP range matching Kind's Docker network
cat <<EOF > /home/vagrant/metallb-config.yaml
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
EOF

kubectl apply -f /home/vagrant/metallb-config.yaml

echo "[+] Deploying Nginx service for testing..."
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=LoadBalancer

echo "[+] Setting up Caddy reverse proxy..."

mkdir -p /home/vagrant/caddy
cat <<EOF > /home/vagrant/caddy/Caddyfile
:8080 {
    reverse_proxy 172.18.255.200
}
EOF

cat <<EOF > /home/vagrant/caddy/docker-compose.yml
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
EOF

cd /home/vagrant/caddy
docker volume create caddy_data || true
docker network create kind || true
docker compose up -d

EONG

echo "[+] Done! Access your app at: http://192.168.56.10:8080"
```

> 📝 **Note**: The MetalLB range is static here. If Kind generates a different subnet in your case, we can update the script to **detect the subnet dynamically** using `docker network inspect kind`.

---

### ✅ Final Output:

After you run:

```bash
vagrant up
```

Your cluster will be live, and your app should be accessible at:
**`http://192.168.56.10:8080`** (from your host).

---

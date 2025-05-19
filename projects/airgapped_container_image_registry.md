# 🛰️ Air-Gapped Container Image Registry (HTTPS + Self-Signed TLS)

Set up a **fully private container registry** for offline or secure networks using **Podman** and **Caddy**, secured with **self-signed certificates**—no internet, no domain, no dependencies.

---

## 🔒 Why an Air-Gapped Image Registry?

Perfect for home labs, enterprise backends, or any **isolated environment**, this setup ensures full control, HTTPS encryption, and local-only access.

### ✅ Key Benefits

#### 🔹 **No Domain, No Public IP**

* No need for static IPs, DNS, or domains.
* Ideal for networks with no internet access.

#### 🔹 **Full Control of Security**

* You issue your own TLS certs—no public CAs.
* Custom cert expiration, revocation, and renewal policies.

#### 🔹 **Internal & Offline Ready**

* Works across LAN, VPN, or fully air-gapped setups.
* Distribute containers without connecting to Docker Hub or Quay.io.

#### 🔹 **Trust-Only What You Want**

* Manually install your CA only where needed.
* Avoid reliance on third-party trust chains.

---

## ⚙️ Setup Instructions

---

### **1️⃣ Install Podman**

#### Ubuntu/Debian:

```bash
sudo apt update && sudo apt install podman podman-compose -y
```

#### Fedora:

```bash
sudo dnf install podman podman-compose -y
```

Enable Podman socket (optional for tooling):

```bash
systemctl enable --now podman.socket
```

---

### **2️⃣ Generate Self-Signed TLS Certificates**

Create a working directory:

```bash
mkdir -p ~/private-registry/certs && cd ~/private-registry/certs
```

#### Generate a Local Certificate Authority (CA):

```bash
openssl req -x509 -newkey rsa:4096 \
  -keyout ca-key.pem -out ca.pem \
  -days 365 -nodes -subj "/CN=SelfSignedCA"
```

#### Generate a Certificate for the Registry:

```bash
openssl req -newkey rsa:4096 \
  -keyout registry-key.pem -out registry-req.pem \
  -nodes -subj "/CN=registry.local"

openssl x509 -req -in registry-req.pem \
  -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
  -out registry-cert.pem -days 365
```

---

### **3️⃣ Compose Your Registry Stack**

Create the folder:

```bash
cd ~/private-registry
mkdir caddy
```

#### 📄 `docker-compose.yml`

```yaml
version: '3'

services:
  registry:
    image: registry:2
    container_name: registry
    ports:
      - "5000:5000"
    volumes:
      - ./certs/registry-cert.pem:/certs/domain.crt:Z
      - ./certs/registry-key.pem:/certs/domain.key:Z
    environment:
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
      REGISTRY_HTTP_TLS_KEY: /certs/domain.key

  caddy:
    image: caddy:latest
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:Z
      - ./certs:/certs:Z
```

---

### **4️⃣ Configure Caddy**

🔐 Generate a password using a temporary Caddy container:

```bash
podman --log-level=debug run --rm -it caddy:latest caddy hash-password --plaintext 'your-password'
```

**Note:** By using `--log-driver=none`, you avoid Podman trying to use `journald` logging, which sometimes causes issues in rootless mode.

#### 📄 `caddy/Caddyfile`

```caddy
registry.local {
    reverse_proxy registry:5000

    basicauth {
        admin <generated-hashed-password>
    }

    tls /certs/registry-cert.pem /certs/registry-key.pem
}
```

---

### **5️⃣ Launch the Registry Stack**

We're going to have a journald permission issue when running Podman in rootless mode. Instead of disabling logging entirely, we can redirect logs to a **file location** rather than relying on journald. This will allow you to **capture logs without modifying Podman’s global settings**.

### **🔹 Solution: Redirect Logs to a File in Compose**
Instead of using `--log-driver=none`, specify **file-based logging** inside your `docker-compose.yml`.

#### **📄 `docker-compose.yml` (With File Logging)**
```yaml
services:
  registry:
    image: registry:2
    container_name: registry
    ports:
      - "5000:5000"
    volumes:
      - ./certs/registry-cert.pem:/certs/domain.crt:Z
      - ./certs/registry-key.pem:/certs/domain.key:Z
      - ./logs:/var/log
    environment:
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
      REGISTRY_HTTP_TLS_KEY: /certs/domain.key
    command: "/bin/sh -c 'registry serve /etc/docker/registry/config.yml >> /var/log/registry.log 2>&1'"

  caddy:
    image: caddy:latest
    container_name: caddy
    ports:
      - "8080:8080"
      - "8443:8443"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:Z
      - ./certs:/certs:Z
      - ./logs:/var/log
    command: "/bin/sh -c 'caddy run --config /etc/caddy/Caddyfile >> /var/log/caddy.log 2>&1'"
```

---

### **🔹 What This Does**
✅ **Logs are stored in `./logs/` inside your container** instead of going to journald.  
✅ **Registry logs are saved to `/var/log/registry.log`.**  
✅ **Caddy logs are saved to `/var/log/caddy.log`.**  
✅ **Errors & standard output are redirected** with `>> /var/log/*.log 2>&1`.
✅ **Unprivileged ports** 8080 and 8443 are being used


**Run the updated compose stack:**
```bash
podman-compose up -d
```

✅ Now, logs will be available in **your `./logs/` folder** instead of system journald!
✅ Works in **rootless** mode while testing and developing

---

### **6️⃣ Trust Your CA Locally**

#### Fedora / RHEL:

```bash
sudo cp ~/private-registry/certs/ca.pem /etc/pki/ca-trust/source/anchors/selfsigned-ca.pem
sudo update-ca-trust
```

#### Ubuntu / Debian:

```bash
sudo cp ~/private-registry/certs/ca.pem /usr/local/share/ca-certificates/selfsigned-ca.crt
sudo update-ca-certificates
```

---

### **7️⃣ Use the Registry**

#### Login:

```bash
podman login --tls-verify=false registry.local
```

#### Push an Image:

```bash
podman pull alpine
podman tag alpine registry.local/alpine
podman push registry.local/alpine
```

---

## 🛠 Use Cases

| Scenario                       | Benefit                                      |
| ------------------------------ | -------------------------------------------- |
| Air-gapped server environments | Fully offline, secure container distribution |
| Secure lab setups              | Rootless, trusted-only container sharing     |
| CI/CD in disconnected networks | Controlled internal registry pipelines       |
| Supply chain verification      | Reproducible, cert-pinned environments       |

---

## ✅ Final Thoughts

Your **air-gapped image registry** is now:

* 🔐 Encrypted with TLS
* 💼 Protected with basic auth
* 📦 Ready for offline or isolated use
* 🧩 Composable and rootless

> Maintain security and control over your entire container delivery pipeline—**no cloud, no dependency, no compromise.**

---

Would you like a version of this as a downloadable PDF or Markdown README for sharing or archiving?

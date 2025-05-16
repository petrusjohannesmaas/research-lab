# HTTPs Container Registry (Self Hosted)

Got it! Let’s go **step by step** to set up your **Podman container registry** with **Caddy as a reverse proxy**, using **authentication and TLS** for security. 

---

### **1. Install Podman**
Make sure **Podman** is installed and running:

#### **Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install podman -y
```

#### **Fedora:**
```bash
sudo dnf install podman -y
```

Enable the **Podman socket**:
```bash
systemctl enable --now podman.socket
```

---

### **2. Run the Registry with Podman**
Start a **private container registry**:
```bash
podman run -d \
  --name registry \
  -p 5000:5000 \
  registry:2
```
This runs your **registry** on **port 5000**, but right now it’s **open** without authentication.

---

### **3. Set Up Caddy as a Reverse Proxy**
Caddy will:
✅ **Proxy** requests to the registry.
✅ **Automatically manage HTTPS** with Let's Encrypt.
✅ **Enable authentication** for security.

Create a directory for your **Caddy config**:
```bash
mkdir -p ~/caddy
nano ~/caddy/Caddyfile
```

Add this **Caddyfile** configuration:
```caddy
registry.yourdomain.com {
    reverse_proxy localhost:5000
    
    basicauth {
        admin JDJhJDE0JEVNSjNOUzl4eG9LMENFUkZVLmM5ZW1wRGNGZXhuUWRnaDE0Rk5kVWZpcTZDR09hZmht
    }

    tls {
        email your@email.com
    }
}
```

### **4. Handling Password Authentication**
You need to **generate a hashed password** instead of using plain text. To do this:

1️⃣ Run this command to generate a **secure password hash**:
```bash
caddy hash-password --plaintext "yoursecurepassword"
```

2️⃣ Copy the output and replace the password in your **Caddyfile**:
```caddy
basicauth {
    admin <your-hashed-password>
}
```
Now, anyone trying to push/pull images **must authenticate** first.

---

### **5. Run Caddy with Podman**
Start **Caddy** using Podman:
```bash
podman run -d \
  --name caddy \
  -p 80:80 -p 443:443 \
  -v ~/caddy/Caddyfile:/etc/caddy/Caddyfile:Z \
  caddy:latest
```
This:
✅ **Secures traffic with HTTPS**  
✅ **Proxies requests to the registry**  
✅ **Enforces authentication**  

---

### **6. Configure DNS for Your Domain**
Go to your **domain registrar** (e.g., Namecheap, GoDaddy) and create an **A record**:

```
Type: A
Name: registry
Value: <your-server-ip>
```

This points **registry.yourdomain.com** to your **Podman host**.

---

### **7. Test & Login to Your Private Registry**
Now, login to your secured registry:
```bash
podman login registry.yourdomain.com
```
Enter your **username and password**.

Try pushing an image:
```bash
podman pull alpine
podman tag alpine registry.yourdomain.com/alpine
podman push registry.yourdomain.com/alpine
```

---
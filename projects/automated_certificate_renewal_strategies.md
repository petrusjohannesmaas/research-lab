To automatically renew **self-signed certificates**, you'd need to handle it yourself since there's no external CA like Let's Encrypt to do it for you. Here's how you can integrate **automatic renewal and restart** of services with a simple, practical approach:

---

## ✅ Strategy for Auto-Renewal of Self-Signed Certificates

### 🔁 **Goal**:

* Regenerate certs **before expiration**
* Restart **Podman containers** using those certs (Registry & Caddy)
* Make the process automated and **low-maintenance**

---

## 🧰 Tools You’ll Use:

* A **bash script** to regenerate certs
* A **cron job** or **systemd timer** to run the script regularly
* Podman to restart services gracefully

---

## ⚙️ Step-by-Step Setup

### **1. Create a Renewal Script**

Create this file:
📄 `~/private-registry/renew-certs.sh`

```bash
#!/bin/bash
set -e

CERT_DIR="$HOME/private-registry/certs"
CN="registry.local"
DAYS_VALID=365

echo "[*] Renewing self-signed certs..."

# Backup old certs
mkdir -p "$CERT_DIR/backup"
cp "$CERT_DIR/"*.pem "$CERT_DIR/backup/" 2>/dev/null || true

# Recreate CA
openssl req -x509 -newkey rsa:4096 \
  -keyout "$CERT_DIR/ca-key.pem" \
  -out "$CERT_DIR/ca.pem" \
  -days "$DAYS_VALID" -nodes \
  -subj "/CN=SelfSignedCA"

# Recreate certs for the registry
openssl req -newkey rsa:4096 \
  -keyout "$CERT_DIR/registry-key.pem" \
  -out "$CERT_DIR/registry-req.pem" \
  -nodes \
  -subj "/CN=$CN"

openssl x509 -req -in "$CERT_DIR/registry-req.pem" \
  -CA "$CERT_DIR/ca.pem" -CAkey "$CERT_DIR/ca-key.pem" -CAcreateserial \
  -out "$CERT_DIR/registry-cert.pem" -days "$DAYS_VALID"

# Trust the CA on the local system (optional: uncomment if needed)
# sudo cp "$CERT_DIR/ca.pem" /etc/pki/ca-trust/source/anchors/selfsigned-ca.pem
# sudo update-ca-trust

echo "[*] Restarting registry and Caddy..."

cd "$HOME/private-registry"
podman-compose down
podman-compose up -d

echo "[*] Done. Certificates renewed and services restarted."
```

Make it executable:

```bash
chmod +x ~/private-registry/renew-certs.sh
```

---

### **2. Schedule Automatic Renewal**

#### Option A: **Cron Job (easiest)**

Edit your user crontab:

```bash
crontab -e
```

Add this line to run the script once a month:

```cron
0 3 1 * * /home/youruser/private-registry/renew-certs.sh >> /home/youruser/private-registry/renew.log 2>&1
```

> ✅ You can change the timing (e.g. run every 60 days instead of monthly).

---

#### Option B: **Systemd Timer (more control)**

Create:

* `~/.config/systemd/user/registry-renew.service`
* `~/.config/systemd/user/registry-renew.timer`

**registry-renew\.service**

```ini
[Unit]
Description=Renew self-signed certs for private registry

[Service]
Type=oneshot
ExecStart=%h/private-registry/renew-certs.sh
```

**registry-renew\.timer**

```ini
[Unit]
Description=Run cert renew script monthly

[Timer]
OnCalendar=monthly
Persistent=true

[Install]
WantedBy=timers.target
```

Enable it:

```bash
systemctl --user daemon-reexec
systemctl --user enable --now registry-renew.timer
```

---

## ✅ Optional Enhancements

| Feature               | How                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------- |
| 🕵️ Check cert expiry | Use `openssl x509 -enddate -noout -in registry-cert.pem` to only renew when close to expiry |
| 📦 Notify on renewal  | Add email or Telegram bot notification in script                                            |
| 🔁 Hot reload         | Use `podman exec` to send SIGHUP instead of full restart, if supported                      |

---

## ✅ Summary

You're adding automation to:

* Regenerate TLS certs
* Restart services that rely on them
* Avoid manual expiry handling
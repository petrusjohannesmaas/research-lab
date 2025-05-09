### **🚀 Steps to Set Up a Remote Linux Server & SSH Access**

#### **1️⃣ Choose & Set Up a Remote Linux Server**
- Register on a cloud provider like **DigitalOcean**, **AWS**, or **Linode**.
- Launch a **Linux-based instance** (Ubuntu, Debian, or CentOS).
- Note your **server IP address** and the default SSH credentials.

---

#### **2️⃣ Generate Two SSH Key Pairs**
On your **local machine**, create two separate key pairs:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_key1
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_key2
```
✔ This creates:
- **`id_rsa_key1`** & **`id_rsa_key2`** (private keys)
- **`id_rsa_key1.pub`** & **`id_rsa_key2.pub`** (public keys)

---

#### **3️⃣ Add SSH Keys to the Server**
Copy both **public keys** to the server:
```bash
ssh-copy-id -i ~/.ssh/id_rsa_key1.pub user@server-ip
ssh-copy-id -i ~/.ssh/id_rsa_key2.pub user@server-ip
```
✅ This adds both keys to **`~/.ssh/authorized_keys`** on the remote server.

Verify:
```bash
ssh user@server-ip
```
✔ If successful, SSH access works **without passwords**.

---

#### **4️⃣ Test SSH Connection with Keys**
Try connecting with **each key separately**:
```bash
ssh -i ~/.ssh/id_rsa_key1 user@server-ip
ssh -i ~/.ssh/id_rsa_key2 user@server-ip
```
✔ You should be able to connect **using either key**.

---

#### **5️⃣ Simplify SSH Access with `~/.ssh/config`**
Edit your **SSH config file**:
```bash
nano ~/.ssh/config
```
Add:
```ini
Host myserver
    HostName server-ip
    User user
    IdentityFile ~/.ssh/id_rsa_key1
```
Save & exit (`Ctrl + X`, `Y`, `Enter`).

✅ Now, connect using:
```bash
ssh myserver
```

---

#### **🎯 Stretch Goal: Install & Configure Fail2Ban**
Protect against **brute-force attacks** by installing `fail2ban`:
```bash
sudo apt install fail2ban -y
```
Enable **SSH protection**:
```bash
sudo nano /etc/fail2ban/jail.local
```
Add:
```ini
[sshd]
enabled = true
bantime = 600
findtime = 600
maxretry = 3
```
✔ **This blocks repeated failed SSH login attempts**.

Restart Fail2Ban:
```bash
sudo systemctl restart fail2ban
```

---

### **📜 Solution Submission**
Create a **README.md** file documenting your steps:
```bash
nano README.md
```
✔ **Include instructions**, but **never push private keys** to public repositories!

---

### **🚀 Want More?**
Would you like to **automate this setup** using Ansible?
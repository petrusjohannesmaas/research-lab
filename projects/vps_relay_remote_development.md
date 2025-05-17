# VPS Relay

Using a **VPS as a relay** will let both your local machine and the remote computer establish a connection, even without public IPs. Here’s how to set it up:

### **Step 1: Get a VPS with a Public IP**
- You can use providers like **Linode, DigitalOcean, AWS, Hetzner, Vultr**.
- Choose a small instance (a cheap $5/mo VPS should work fine).

### **Step 2: Install WireGuard on the VPS**
1. **Install WireGuard**:
   ```bash
   sudo apt update && sudo apt install wireguard
   ```
2. **Generate keys**:
   ```bash
   wg genkey | tee privatekey | wg pubkey > publickey
   ```

### **Step 3: Configure the VPN on the VPS**
Edit `/etc/wireguard/wg0.conf`:
```ini
[Interface]
PrivateKey = <server_private_key>
Address = 10.0.0.1/24
ListenPort = 51820

# Peer 1 (your local machine)
[Peer]
PublicKey = <client_public_key>
AllowedIPs = 10.0.0.2/32

# Peer 2 (your remote machine)
[Peer]
PublicKey = <remote_client_public_key>
AllowedIPs = 10.0.0.3/32
```
Enable forwarding:
```bash
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```
Start WireGuard:
```bash
sudo wg-quick up wg0
```

### **Step 4: Configure WireGuard on Your Local and Remote Machines**
Each device needs its own `wg0.conf`, pointing to the VPS as its peer.

#### **Local machine:**
```ini
[Interface]
PrivateKey = <client_private_key>
Address = 10.0.0.2/24

[Peer]
PublicKey = <server_public_key>
Endpoint = <VPS_public_IP>:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

#### **Remote machine:**
```ini
[Interface]
PrivateKey = <remote_client_private_key>
Address = 10.0.0.3/24

[Peer]
PublicKey = <server_public_key>
Endpoint = <VPS_public_IP>:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

### **Step 5: Test SSH Connectivity**
Once WireGuard is running on all machines, you should be able to **SSH from your local machine to the remote one** through the VPN:
```bash
ssh user@10.0.0.3
```

Would you like help with securing the setup, such as firewall rules or fail2ban integration?
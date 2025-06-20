# ☁️ Azure VPN Relay with WireGuard

### 🔹 **Step 1: Create an Azure VM to Act as the Relay**

You can use a small, cost-effective VM like `Standard B1s`:

```bash
az vm create \
  --resource-group myResourceGroup \
  --name relay-vm \
  --image UbuntuLTS \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-address relayPublicIP
```

> This gives you a **VM with a public IP**, essential for the relay.

---

### 🔹 **Step 2: Install WireGuard on the Azure VM**

SSH into the VM and install WireGuard:

```bash
ssh azureuser@<public-ip>

sudo apt update && sudo apt install -y wireguard
```

Generate keys:

```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

---

### 🔹 **Step 3: Configure `/etc/wireguard/wg0.conf` on the Azure VM**

```ini
[Interface]
Address = 10.10.0.1/24
PrivateKey = <relay_vm_private_key>
ListenPort = 51820

# Local machine
[Peer]
PublicKey = <local_peer_public_key>
AllowedIPs = 10.10.0.2/32

# Remote machine
[Peer]
PublicKey = <remote_peer_public_key>
AllowedIPs = 10.10.0.3/32
```

Enable IP forwarding:

```bash
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

Start the service:

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

---

### 🔹 **Step 4: Configure Peers (Local and Remote)**

#### **Local Machine (`10.10.0.2`)**

```ini
[Interface]
Address = 10.10.0.2/24
PrivateKey = <local_private_key>

[Peer]
PublicKey = <relay_public_key>
Endpoint = <relay_public_ip>:51820
AllowedIPs = 10.10.0.0/24
PersistentKeepalive = 25
```

#### **Remote Machine (`10.10.0.3`)**

```ini
[Interface]
Address = 10.10.0.3/24
PrivateKey = <remote_private_key>

[Peer]
PublicKey = <relay_public_key>
Endpoint = <relay_public_ip>:51820
AllowedIPs = 10.10.0.0/24
PersistentKeepalive = 25
```

---

### 🔐 **Step 5: Secure with NSG Rules**

Allow UDP 51820 only from your peer IPs:

```bash
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name relay-vmNSG \
  --name AllowWireGuard \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Udp \
  --destination-port-range 51820 \
  --source-address-prefixes <your-ip>/32
```

Also, block all other unnecessary inbound traffic as needed.

---

### 🧪 **Step 6: Test SSH Over the VPN**

After bringing up all configs:

```bash
sudo wg-quick up wg0
```

SSH through the VPN subnet:

```bash
ssh user@10.10.0.3
```

---
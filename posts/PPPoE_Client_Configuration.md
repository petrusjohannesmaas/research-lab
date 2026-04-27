---
title: "PPPoE Client Configuration"
description: "Technical steps for configuring PPPoE clients on Linux and networking hardware."
slug: "pppoe-client-configuration"
date: "2026-02-04"
tags: ['Networking', 'ISP', 'Linux']
author: "Petrus Johannes Maas"
---

## ️ PPPoE Client Configuration on Ubuntu Server

### Prerequisites

- Ubuntu Server (20.04 or later)
- Ethernet cable connected to a DSL modem or PPPoE-enabled router
- Valid PPPoE credentials (username and password)
- Root or sudo access


### 1. **Install PPPoE Configuration Tool**

```bash
sudo apt update
sudo apt install pppoeconf

```


### 2. **Connect Ethernet Cable**

Plug your DSL or WAN cable into the Ethernet port (e.g., `eth0`) on your server.


### 3. **Run PPPoE Configuration Wizard**

```bash
sudo pppoeconf

```

This interactive wizard will:

- Detect available Ethernet interfaces
- Prompt for your PPPoE username and password
- Ask whether to use peer DNS (select **Yes** if you don’t have a local DNS resolver)
- Ask whether to set Limited MSS (select **Yes** to avoid packet fragmentation)
- Ask whether to connect at startup (select **Yes** if you want auto-connect)
- Ask whether to establish the connection now (select **Yes**)


### 4. **Verify Configuration Files**

- **Credentials:** `/etc/ppp/chap-secrets`
- **Connection settings:** `/etc/ppp/peers/dsl-provider`
- **Interface settings (optional):** `/etc/network/interfaces`


### 5. **Start and Stop PPPoE Connection**

- **Connect:**
    
    ```bash
    sudo pon dsl-provider
    
    ```
    
- **Disconnect:**
    
    ```bash
    sudo poff dsl-provider
    
    ```
    


### 6. **Enable Auto-Connect on Boot**

If you selected “connect at startup” during setup, the system will automatically run `pon dsl-provider` at boot. To manually enable it:

```bash
sudo systemctl enable pppd-dns

```


### 7. **Troubleshooting Tips**

- Check logs: `sudo journalctl -xe` or `cat /var/log/syslog`
- Test connectivity: `ping 8.8.8.8` or `curl https://example.com`
- Restart PPPoE: `sudo poff dsl-provider && sudo pon dsl-provider`


### Optional Enhancements

- Configure firewall rules with `ufw` or `iptables`
- Set up NAT if sharing the connection with other devices
- Monitor connection status with custom scripts or `pppstats`


Sources:   [Appuals](https://appuals.com/how-to-setup-ubuntu-server-as-a-router-using-pppoe/)  [Ask Ubuntu](https://askubuntu.com/questions/1193856/how-to-establish-pppoe-connection-in-ubuntu)  [pcmasterx.com](https://pcmasterx.com/index.php/blog/create-pppoe-connection-on-ubuntu-server)

## Disclaimer & Intent 

This project was developed for **research and portfolio purposes**. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

## License
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

### Third-Party Attribution
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.
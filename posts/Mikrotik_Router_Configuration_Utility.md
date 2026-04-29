---
title: "Mikrotik Router Configuration Utility"
description: "Automation scripts for configuring Mikrotik networking equipment via API or CLI."
slug: "mikrotik-router-configuration-utility"
date: "2025-12-12"
tags: ['Networking', 'Mikrotik', 'Automation']
author: "Petrus Johannes Maas"
---

# **Mikrotik hAP ac² Utility**

This utility is based on [Mikrotik's official first-time configuration guide](https://help.mikrotik.com/docs/display/ROS/First+Time+Configuration).

---

## **Real-World Scenario**

You're configuring a network with:
- An **office Ethernet WAN** connection.
- A **Mikrotik hAP ac² router**.
- A **desktop** running VS Code.
- A **laptop** serving as a Jupyter Lab server.
- Both devices need **internet access**.
- A **WiFi connection** is required for the laptop when working from another office.
- A **LAN tunnel** is needed for VS Code.

### **Network Setup Steps**
1. **Internet Access**  
   - Connect the office Ethernet cable (**WAN**) to the router's **WAN port**.  
   - Configure DHCP or static settings for ISP access.

2. **Local Network (LAN)**  
   - The router provides both wired and wireless connections.  
   - Connect the desktop and laptop via **LAN ports or WiFi**.

3. **Laptop WiFi in Another Office**  
   - Configure the router with a **WiFi SSID** and secure credentials for seamless roaming.

4. **VS Code Tunnel Over LAN**  
   - Set up a **local network (LAN)** with appropriate IP configurations to ensure communication between the desktop and laptop.

---

## **Testing Communication**

**Note:** Ensure you have access to the router / that it's reset properly.

 **Default SSH Connection Details**
```text
IP: 192.168.88.1
User: admin
Password: (empty)
```

On a successful login, you'll see the following interface:
```shell
  MMM      MMM       KKK                          TTTTTTTTTTT      KKK
  MMMM    MMMM       KKK                          TTTTTTTTTTT      KKK
  MMM MMMM MMM  III  KKK  KKK  RRRRRR     OOOOOO      TTT     III  KKK  KKK
  MMM  MM  MMM  III  KKKKK     RRR  RRR  OOO  OOO     TTT     III  KKKKK
  MMM      MMM  III  KKK KKK   RRRRRR    OOO  OOO     TTT     III  KKK KKK
  MMM      MMM  III  KKK  KKK  RRR  RRR   OOOOOO      TTT     III  KKK  KKK

  MikroTik RouterOS 7.14.1 (c) 1999-2024       https://www.mikrotik.com/
```

---

## **Tools Required to Run the Script**
- **Paramiko** → Used for SSH connections, executing RouterOS commands, and closing sessions.
- **Jsonify** → Converts command responses into structured, human-readable formats.
- **Flask Framework API** → Sends **POST requests** to HTTP endpoints that trigger arrays of RouterOS commands.
- **Thunder Client VS Code Extension or Curl** → Used to send HTTP requests.

---

## **Script Overview**

#### **Information Retrieval (hapac2_info.py)**

These functions retrieve the router’s status and settings:
- `/get-ip-info` → Retrieves IP configuration details.
- `/get-interface-status` → Displays active network interfaces.
- `/get-firewall-rules` → Lists firewall rules.
- `/get-nat-rules` → Shows active NAT rules.
- `/get-routing-table` → Retrieves the routing table.
- `/get-system-info` → Provides system information.

#### **Configuration Functions (hapac2_config.py)**

These functions set up network configurations based on **official Mikrotik documentation**:
- `/setup-bridge` → Configures a **bridge**, IP settings, and DHCP server.
- `/setup-wan` → Sets up the **WAN connection**, including DHCP client and PPPoE.
- `/ping-test` → Runs a connectivity test by **pinging 8.8.8.8**.
- `/setup-user` → Adds a new user and **removes the default admin**.
- `/disable-services` → Disables unnecessary services like **proxy and SOCKS**.
- `/setup-firewall` → Configures **NAT, port forwarding, and firewall rules**.

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

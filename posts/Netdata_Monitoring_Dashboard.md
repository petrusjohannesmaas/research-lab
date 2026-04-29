---
title: "Netdata Monitoring Dashboard"
description: "Setting up real-time performance monitoring and visualization using Netdata."
slug: "netdata-monitoring-dashboard"
date: "2026-01-20"
tags: ['Monitoring', 'Sysadmin', 'Dashboards']
author: "Petrus Johannes Maas"
---

# Netdata Monitoring Dashboard

This project is a simple monitoring dashboard for a single server.

The process is really simple, I used this guide as a reference:
https://cloudcone.com/docs/article/how-to-install-netdata-on-ubuntu-20-04/

## Getting Started

Clone this repository:
```bash
git clone https://github.com/petrusjohannesmaas/roadmap.sh/ && cd roadmap.sh/simple-monitoring
```

Make the scripts executable:
```bash
chmod +x *.sh
```

Run the setup script:
```bash
./setup.sh
```

Wait for the script to complete. You can check the dashboard at: http://localhost:19999/

To **simulate system load**, run the test script:
```bash
./test_load.sh
```

**Note:** Adjust the for loop in `test_load.sh` to change the number of CPU and disk I/O operations.

Clean up the setup:
```bash
./cleanup.sh
```

## Manual Configuration

### **1. Install Netdata**
Install the Netdata package:

```bash
sudo apt update && sudo apt install netdata   # Debian-based
sudo yum install netdata                      # CentOS/RHEL-based
```
Enable and start the service:
```bash
sudo systemctl enable netdata
sudo systemctl start netdata
```

### **2. Configure Basic Monitoring**
Once installed, Netdata automatically collects system metrics. You can check and configure settings at:
```bash
/etc/netdata/netdata.conf
```
Modify the `[web]` section to adjust dashboard settings.

I updated the `bind socket to IP` value to my server's IP to allow remote access.

### **3. Access the Dashboard**
By default, Netdata serves its dashboard on port `19999`. Open it in your browser:
```
http://<SERVER-IP>:19999/
```
To allow remote access, configure firewall settings:
```bash
sudo ufw allow 19999/tcp
```

### **4. Customize the Dashboard**
To modify existing charts or add new ones:
- Edit `/etc/netdata/python.d.conf`
- Create custom monitoring plugins under `/usr/lib/netdata/plugins.d/`

Example: To add a custom CPU chart, edit `/etc/netdata/netdata.conf`:
```bash
[plugin:proc]
        enable_cpu=true
```

### **5. Set Up Alerts**
Netdata supports automatic alarms. Configure thresholds in:
```bash
/etc/netdata/health.d/
```
Example alert for CPU above 80%:
```yaml
template: high_cpu_usage
      on: system.cpu
      os: linux
      lookup: average
      units: percentage
      every: 10s
      warn: $this > 80
```
Restart Netdata to apply changes:
```bash
sudo systemctl restart netdata
```

### **Future Enhancements**
* Integrate into a basic CI/CD pipeline using GitHub Actions or GitLab CI/CD to automate deployments.
* Dynamically add the server's IP to it's config for remote access.
* Create more scripts to automate specific tasks, such as backups, monitoring, or system maintenance.
* Create presets / monitoring templates for Kubernetes or Docker containers.

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

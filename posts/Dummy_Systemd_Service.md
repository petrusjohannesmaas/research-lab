---
title: "Systemd Service Guide"
description: "A guide on setting up a basic Systemd service. "
slug: "systemd-service-guide"
date: "2024-04-1"
tags: ['Linux', 'Systemd', 'Bash']
author: "Petrus Johannes Maas"
---

# Systemd Service Guide

## Overview

This is a guide on how to create and manage  your own systemd service with a dummy script as the example.

### **1. Create the Dummy Script**
Create a file called `dummy.sh` and add the following content:

```bash
#!/bin/bash

while true; do
  echo "$(date) | Dummy service is running..." >> /var/log/dummy-service.log
  sleep 10
done
```

Save the file and make it executable:

```bash
chmod +x dummy.sh
```

Copy the file to the proper directory:
```sh
sudo mv dummy.sh /usr/local/bin/dummy.sh
```

### **2. Create the Systemd Service File**
Create a new systemd service file:

```bash
sudo vi /etc/systemd/system/dummy.service
```

Add the following content:

```ini
[Unit]
Description=Dummy service
After=network.target

[Service]
ExecStart=/usr/local/bin/dummy.sh
Restart=always
User=root
StandardOutput=append:/var/log/dummy-service.log
StandardError=append:/var/log/dummy-service.log

[Install]
WantedBy=multi-user.target
```

Also make sure to set the log file permissions properly to avoid systemd errors:

```sh
sudo touch /var/log/dummy-service.log
sudo chmod 644 /var/log/dummy-service.log
```


### **3. Reload Systemd and Enable the Service**
Run these commands to apply the changes:

```bash
sudo systemctl daemon-reload
sudo systemctl enable dummy
```

### **4. Manage the Service**
You can interact with the service using:

```bash
sudo systemctl start dummy     # Start the service
sudo systemctl stop dummy      # Stop the service
sudo systemctl enable dummy    # Enable the service to start on boot
sudo systemctl disable dummy   # Disable the service
sudo systemctl status dummy    # Check the service status
```

### **5. Check Logs**
Check your log file:

```bash
cat /var/log/dummy-service.log
```

### **6. Ensure the Service Auto-Restarts**
If the service crashes, `Restart=always` ensures it restarts.

---



**Disclaimer & Intent**:
This project was developed for research and portfolio purposes. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

**License**:
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)
Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

**Third-Party Attribution**:
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.
````

---
title: "Web Server Utilities"
description: "Helpful scripts and configurations for managing Nginx or Apache web server instances."
slug: "web-server-utilities"
date: "2026-04-10"
tags: ['Web-Server', 'Linux', 'Sysadmin']
author: "Petrus Johannes Maas"
---

# Server Utilities

### 🧠 Overview
* `server-stats.sh` is a bash script to get basic stats for any Linux system *(CPU, RAM, Disk usage, etc.)
* `benchmark.sh`: Run a basic benchmark test on your hardware. 
* `web-server-status.sh`: Check if a specific set of web servers are currently up *(or down)* and create a log file. 

**Dependencies**:

`benchmark.sh` requires the "**sysbench**" and "**lshw**" packages to run.
```sh
sudo apt install sysbench lshw
```

---

### ⚡️ How to use the scripts

**Clone the repository**:
```shell
git clone https://github.com/petrusjohannesmaas/server-stats
cd server-stats
```

**Make a script executable**:
```shell
chmod +x the-script.sh
```

**Execute the script**:
```shell
./the-script.sh
```

---

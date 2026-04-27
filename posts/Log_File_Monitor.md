---
title: "Log File Monitor"
description: "A real-time monitoring tool that watches log files for specific patterns or errors."
slug: "log-file-monitor"
date: "2025-11-05"
tags: ['Monitoring', 'Logging', 'Python']
author: "Petrus Johannes Maas"
---

## Log File Monitor in Python

### Overview
This project creates a Python script that continuously monitors a log file (e.g., system logs, application logs) for specific keywords or patterns. When a match is found, it can trigger an alert, write to a separate file, or send a notification.

---

## ️ Requirements
- Python 3.7+
- Basic understanding of regular expressions
- Access to log files (e.g., `/var/log/syslog`, `app.log`)

---

## Project Structure
```
log-monitor/
├── monitor.py
├── config.json
└── README.md
```

---

## ️ Configuration File (config.json)
```json
{
  "log_file": "/var/log/syslog",
  "patterns": ["ERROR", "CRITICAL", "Failed login"],
  "alert_file": "alerts.log",
  "poll_interval": 2
}
```

---

## Script Logic (monitor.py)
```python
import time
import json
import re

def load_config(path="config.json"):
    with open(path) as f:
        return json.load(f)

def monitor_log(config):
    log_path = config["log_file"]
    patterns = [re.compile(p) for p in config["patterns"]]
    alert_file = config["alert_file"]
    interval = config["poll_interval"]

    with open(log_path, "r") as logfile:
        logfile.seek(0, 2)  # Move to end of file
        while True:
            line = logfile.readline()
            if not line:
                time.sleep(interval)
                continue
            for pattern in patterns:
                if pattern.search(line):
                    with open(alert_file, "a") as alert:
                        alert.write(line)
                    print(f"ALERT: {line.strip()}")

if __name__ == "__main__":
    config = load_config()
    monitor_log(config)
```

---

## How to Run
```bash
python3 monitor.py
```

Make sure the script has permission to read the target log file.

---

## Features
- Monitors log file in real-time
- Supports multiple search patterns
- Writes matched lines to a separate alert file
- Configurable polling interval

---

## Optional Enhancements
- Add email or SMS alerts
- Use `watchdog` for event-driven monitoring
- Add a web dashboard with Flask
- Support multiple log files

---

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
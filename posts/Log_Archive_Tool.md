---
title: "Log Archive Tool"
description: "A script for rotating, compressing, and archiving old log files to save disk space."
slug: "log-archive-tool"
date: "2025-10-14"
tags: ['Linux', 'Logging', 'Utilities']
author: "Petrus Johannes Maas"
---

# Log Archive Tool

### **Project Structure**
```
log-archive/
├── log-archive.sh  # Bash script
├── README.md       # Documentation
└── archives/       # Directory where archived logs will be stored
```

---

## Overview
This Bash-based CLI tool archives logs by compressing them into a `.tar.gz` file and storing them in a dedicated `archives` directory. It ensures old logs are stored efficiently while keeping your system clean.

## Features
- Accepts the log directory as an argument.
- Compresses logs using `tar.gz`.
- Stores archives in a designated folder.
- Logs the archive creation date and time.

## Requirements
- Unix-based system (Linux/macOS)
- Bash shell
- `tar` command available

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/petrusjohannesmaas/roadmap.sh/
   cd log-archive-tool
   ```

2. Make the script executable:
   ```bash
   chmod +x log-archive.sh
   ```

## Usage
Run the script with the desired log directory:
```bash
sudo ./log-archive.sh /var/log
```
Example output:
```
Logs archived successfully: archives/logs_archive_20240816_100648.tar.gz
```

**Note:** Depending on the logs, you might need to run the script with `sudo` privileges.

There should be a new archive file in the `archives` directory.

## Questions

**How to change the archive name?**
* You can change the name and location of the archive by modifying the `ARCHIVE_NAME` variable in the `log-archive.sh` script.

**How to extract the archived logs?**

* To extract or "untar" the archives you've created, you can use the `tar` command. 

```bash
tar -xzf archives/logs_archive_YYYYMMDD_HHMMSS.tar.gz -C /your/destination/path
```

**Explanation:**

- `tar` is the command-line tool for handling `.tar` files.
- `-x` tells `tar` to extract.
- `-z` indicates that the archive is compressed using gzip (`.tar.gz`).
- `-f` specifies the archive file you want to extract.
- `-C` lets you set the destination directory where the extracted files should go.

If you want to extract it into the current directory, simply omit the `-C` flag:

```bash
tar -xzf archives/logs_archive_YYYYMMDD_HHMMSS.tar.gz
```

You can also list the contents of an archive before extracting it using:

```bash
tar -tzf archives/logs_archive_YYYYMMDD_HHMMSS.tar.gz
```

## Future Enhancements

- Schedule automatic archiving via `cron`.
- Send email notifications upon completion.
- Upload archives to remote storage (via `scp` or `rsync`).

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

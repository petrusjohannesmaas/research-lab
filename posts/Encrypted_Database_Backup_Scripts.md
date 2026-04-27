---
title: "Encrypted Database Backup Scripts"
description: "Security-focused scripts for performing automated, encrypted backups of production databases."
slug: "encrypted-database-backup-scripts"
date: "2025-01-19"
tags: ['Security', 'Database', 'Backup']
author: "Petrus Johannes Maas"
---

# Encrypted Database Backup Scripts

This repository provides a simple and secure solution for creating and backing up a SQLite database with AES-256 encryption using OpenSSL. There are instructions at the bottom for automating the process with `cron`.


**Future Enhancements:**

* 🔄 Add support for `mysql`, `mongodb`, and `postgresql`
* 🗜️ Compress the backups using `gzip`
* ✅ Add a checksum for integrity verification
* 📜 Log backup activities for audit tracking
* ☁️ Store backups in cloud storage (e.g., AWS S3, Google Drive)
* 🚨 Add an alert/notification system

---

##  Getting started

Follow this guide to securely back up your SQLite databases and restore them when needed.

---

## 1️⃣ Install SQLite & OpenSSL

Ensure you have both **SQLite** and **OpenSSL** installed on your system.

*(If you don't want to install it, you can use my database in this repository instead, or your own.)*

### Install SQLite

```bash
sudo apt install sqlite3 -y  # Debian/Ubuntu
sudo dnf install sqlite -y   # Fedora/RHEL
````

Verify installation:

```bash
sqlite3 --version
```

### Install OpenSSL

```bash
sudo apt install openssl -y
sudo dnf install openssl -y
```

Check OpenSSL:

```bash
openssl version
```

---

## 2️⃣ Create a SQLite Database

Create a directory for your databases:

```bash
mkdir -p ~/databases
```

Create a new database and enter the SQLite shell:

```bash
sqlite3 ~/databases/test_database.sqlite
```

Inside the shell:

```sql
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
SELECT * FROM users;
.exit
```

Verify the database file exists:

```bash
ls -l ~/databases/
```

---

## 3️⃣ Create & Test the Encrypted Backup Script

### Create the Script

Create a file named `backup.sh` and paste following script:

```bash
vi ~/backup.sh
```

**Note:** You should update the file paths and passphrase as needed if you're using a different database or backup directory.

```bash
#!/bin/bash

# Configuration
DB_FILE="$HOME/databases/test_database.sqlite"
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/test_database-$TIMESTAMP.sqlite"
ENCRYPTED_FILE="$BACKUP_FILE.enc"
PASSPHRASE="secret"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Copy SQLite database to backup location
cp "$DB_FILE" "$BACKUP_FILE"

# Encrypt backup using AES-256
openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in "$BACKUP_FILE" -out "$ENCRYPTED_FILE" -pass pass:"$PASSPHRASE"

# Remove unencrypted backup
rm -f "$BACKUP_FILE"

echo "Backup completed and encrypted: $ENCRYPTED_FILE"
```

Make the script executable:

```bash
chmod +x ~/backup.sh
```

Run it:

```bash
~/backup.sh
```

Check that an encrypted backup was created:

```bash
ls -l ~/backups/
```

---

## 4️⃣ Restoring the Backup

To decrypt and restore the backup, use the **same encryption flags** as used during backup:

```bash
openssl enc -aes-256-cbc -d -salt -pbkdf2 -iter 100000 \
-in ~/backups/test_database-YYYY-MM-DD_HH-MM-SS.sqlite.enc \
-out restored.sqlite -pass pass:"secret"
```

Verify contents:

```bash
sqlite3 restored.sqlite "SELECT * FROM users;"
```

---

## 5️⃣ Automate with Cron

Schedule the script to run every day at 2 AM:

```bash
crontab -e
```

Add the following line:

```cron
0 2 * * * ~/backup.sh
```

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
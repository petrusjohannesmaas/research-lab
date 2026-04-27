---
title: "Linux User Management Tool"
description: "A shell or Python utility for managing user accounts and permissions across Linux servers."
slug: "linux-user-management-tool"
date: "2025-09-30"
tags: ['Linux', 'Sysadmin', 'Security']
author: "Petrus Johannes Maas"
---

# User Management Tool (Linux)

#### ️ Security Note

* Only root / sudo users can run it, so be cautious — no input validation on usernames yet. I'm still planning on adding regex validation later.
* Avoid running this on production systems without careful testing.

## **Overview**

#### 1. **Create Users**

* Prompt for a username.
* Create the user with `useradd`.
* Optionally set a password.

#### 2. **Add to Sudo Group**

* Prompt for a username.
* Use `usermod -aG sudo <user>`.
* Reload group with `newgrp sudo`.

#### 3. **List All Users & Permissions**

* Parse `/etc/passwd` and `/etc/group` to display usernames and if they are in the `sudo` group.

#### 4. **Delete Users**

* Prompt for username.
* Confirm deletion.
* Delete using `userdel -r <user>` (removes home dir too).


## How To Guide:

**Clone my repository:**

```sh
git clone https://github.com/petrusjohannesmaas/user-mgmt-tool
cd user-mgmt-tool
```
*(or just copy the contents of `usrmgr.sh` and create your own file)*

**Make the script executable:**

```bash
chmod +x usrmgr.sh
```

**Run as sudo user:**

```bash
sudo ./usrmgr.sh
```

**or log in as root if you're not a sudo user yet:**
```sh
su -
```

---

### Check out all my other projects here: [My projects](https://petrusjohannesmaas.github.io/research-lab/projects.html)

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
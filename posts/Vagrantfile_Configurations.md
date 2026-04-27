---
title: "Vagrantfile Configurations"
description: "A collection of Vagrantfile examples for reproducible development environments."
slug: "vagrantfile-configurations"
date: "2026-04-02"
tags: ['Vagrant', 'DevOps', 'Infrastructure']
author: "Petrus Johannes Maas"
---

# Vagrant VM Setup Guide

## Overview
Vagrant is a tool for building and managing virtual machine environments in a single workflow. It allows developers to create portable, reproducible development environments using simple configuration files.


## ️ Prerequisites
- [VirtualBox](https://www.virtualbox.org/) or another supported provider
- [Vagrant](https://www.vagrantup.com/) installed
- Terminal or command prompt access


## Project Structure
```
vagrant-vm/
├── Vagrantfile
├── provision.sh
└── README.md
```


## ️ Vagrantfile Configuration

### Basic Vagrantfile Example
```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"

  # Networking
  config.vm.network "private_network", ip: "192.168.56.10"

  # Resource Allocation
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    vb.cpus = 2
  end

  # Provisioning
  config.vm.provision "shell", path: "provision.sh"
end
```


## Networking Options

| Type             | Description |
|------------------|-------------|
| `forwarded_port` | Maps guest port to host (e.g., 8080 → 80) |
| `private_network`| Host-only network (e.g., 192.168.x.x) |
| `public_network` | Bridges to your physical network |

**Example:**
```ruby
config.vm.network "forwarded_port", guest: 80, host: 8080
```


## Resource Allocation

| Setting | Description |
|---------|-------------|
| `vb.memory` | Allocates RAM (in MB) |
| `vb.cpus`   | Number of CPU cores |

**Tip:** Keep memory under 50% of your host’s total RAM for performance.


## Provisioning Script (provision.sh)
```bash
#!/bin/bash

# Update and install packages
apt-get update
apt-get install -y nginx curl git

# Start and enable Nginx
systemctl enable nginx
systemctl start nginx

# Custom welcome page
echo "<h1>Welcome to your Vagrant VM!</h1>" > /var/www/html/index.html
```

Make sure the script is executable:
```bash
chmod +x provision.sh
```


## Usage Commands

| Command | Description |
|---------|-------------|
| `vagrant up` | Starts and provisions the VM |
| `vagrant ssh` | SSH into the VM |
| `vagrant halt` | Shuts down the VM |
| `vagrant destroy` | Deletes the VM |
| `vagrant reload` | Restarts and re-provisions the VM |


## Best Practices
- Use version-controlled `Vagrantfile` and `provision.sh`
- Keep provisioning idempotent (safe to run multiple times)
- Use environment variables for secrets
- Document IPs and ports for team use


## Further Reading
- [Vagrant Documentation](https://developer.hashicorp.com/vagrant/docs)
- [Networking in Vagrant](https://developer.hashicorp.com/vagrant/docs/networking)
- [Provisioning with Shell](https://developer.hashicorp.com/vagrant/docs/provisioning/shell)


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
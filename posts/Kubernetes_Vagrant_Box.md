---
title: "Kubernetes Vagrant Box"
description: "Using Vagrant to spin up local Kubernetes environments for testing and development."
slug: "kubernetes-vagrant-box"
date: "2025-08-16"
tags: ['Vagrant', 'Kubernetes', 'Development']
author: "Petrus Johannes Maas"
---

# Kubernetes Vagrant Box for Local Cluster Development

This project helps you spin up a fully functional Kubernetes cluster using [Vagrant](https://www.vagrantup.com/) and [Kind](https://kind.sigs.k8s.io/) inside a [Debian 12](https://www.debian.org/) virtual machine — perfect for local development and learning Kubernetes.


## Project Structure

```text
kubernetes-vagrant-box/
├── Vagrantfile
├── dependencies.sh     # Installs Docker, Go, kubectl
├── kind-setup.sh       # Installs Kind & creates a cluster
└── README.md           # You're here
```


## ️ Prerequisites

Make sure the following are installed on your host machine:

* [Vagrant](https://developer.hashicorp.com/vagrant/downloads)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)


## Quickstart

### 1. Clone the Repository

```bash
git clone https://github.com/petrusjohannesmaas/kubernetes-vagrant-box.git
cd kubernetes-vagrant-box
```

### 2. Make Scripts Executable

```bash
chmod +x dependencies.sh kind-setup.sh
```

### 3. Start the Vagrant VM and Provision It

```bash
vagrant up
```

This will:

* Launch a VM using Debian 12
* Install Docker, Go, kubectl
* Install Kind and create a Kubernetes cluster

You’ll see messages like:

```bash
🥳 Dependencies setup complete!
🥳 Kind setup complete!
```


## ️ Usage

### SSH into the Vagrant Box

```bash
vagrant ssh
```

### Verify the Cluster

```bash
kubectl get nodes
```

You should see a single `kind-control-plane` node in `Ready` state.


## Tool Versions

| Tool    | Version       |
| ------- | ------------- |
| OS      | Debian 12     |
| Docker  | Latest stable |
| Go      | 1.24.3        |
| Kind    | 0.29.0        |
| kubectl | Latest stable |


## What’s Inside

### `dependencies.sh`

* Installs Docker and required packages
* Installs Go manually and sets system-wide PATH
* Installs the latest `kubectl` from the official release channel

### ️ `kind-setup.sh`

* Installs Kind with `go install`
* Persists the Kind binary in PATH
* Creates a local Kubernetes cluster


## Networking

The VM is configured with a `private_network` using DHCP:

```ruby
config.vm.network "private_network", type: "dhcp"
```

Use `kubectl port-forward` or install [MetalLB](https://metallb.universe.tf/) for exposing services.


## What's Next?

Explore this repo's companion guide:

📖 [Load Balancing in Kubernetes with MetalLB](https://github.com/pjmaas/research-lab/blob/main/projects/load_balancing_in_k8s.md)

Learn how to expose your services without using `NodePort` or Ingress.


## Future Enhancements

* [ ] Add Kubernetes Dashboard
* [ ] Optional Helm-based provisioning
* [ ] Automate MetalLB setup
* [ ] Shared folder setup for syncing host ↔ VM


## Cleanup

To destroy the VM:

```bash
vagrant destroy
```

To rebuild everything from scratch:

```bash
vagrant up --provision
```


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
---
title: "Proxmox Automation"
description: "Leveraging APIs and tools to automate virtual machine and container management on Proxmox."
slug: "proxmox-automation"
date: "2026-02-18"
tags: ['Virtualization', 'Proxmox', 'Homelab']
author: "Petrus Johannes Maas"
---

# Terraform Proxmox Automation

Automate your Proxmox VE infrastructure provisioning with Terraform. This project helps you define and deploy virtual machines and resources using reusable Terraform modules.

## 🚀 Features

- Create and manage Proxmox VMs via Terraform
- Supports cloud-init for VM customization
- Reusable module structure
- Integrates SSH key and network setup

## 📁 Folder Structure

```
terraform-proxmox-automation/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
├── modules/
│   └── vm/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── README.md
```

## 🛠 Requirements

- Terraform ≥ 1.3.0
- Proxmox VE ≥ 7.x
- [Terraform Proxmox Provider](https://github.com/Telmate/terraform-provider-proxmox)
- Proxmox user with API access

## 🔐 Authentication

Update your `providers.tf` with Proxmox connection details or use environment variables:

```hcl
provider "proxmox" {
  pm_api_url      = var.proxmox_api_url
  pm_user         = var.proxmox_user
  pm_password     = var.proxmox_password
  pm_tls_insecure = true
}
```

## ✅ Usage

```bash
terraform init
terraform plan
terraform apply
```

## 🧩 Module Example

```hcl
module "vm1" {
  source     = "./modules/vm"
  vm_name    = "webserver-01"
  ...
}
```

## 🧳 Roadmap

- ISO-based VM deployment
- Full template automation
- Network bridge configuration
- Linked clone support
- Integration with Jenkins pipelines (future)

## 📝 License

MIT

### 💡 Tips
- You might want to hook in cloud-init templates for SSH and user configuration.
- Wrap secrets like API credentials in a `.env` and add them to `.gitignore`.
- Consider expanding with `provisioners` for first-boot actions or VM labeling.

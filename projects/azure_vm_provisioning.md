# 🚀 Provision an Azure VM with Terraform

### ✅ Prerequisites

- Azure account
- Azure CLI installed and logged in (`az login`)
- Terraform installed ([Install guide](https://developer.hashicorp.com/terraform/downloads))
- Basic terminal/command line knowledge

---

## 🛠 Step 1: Create Project Directory

```bash
mkdir terraform-azure-vm
cd terraform-azure-vm
```

---

## 📄 Step 2: Create Terraform Files

### 1. `main.tf`

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-terraform-vm"
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-terraform"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "subnet-terraform"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "nic" {
  name                = "nic-terraform"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "vm-terraform"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  size                = var.vm_size
  admin_username      = "azureuser"
  network_interface_ids = [azurerm_network_interface.nic.id]

  admin_password = "Terraform123!" # For demo purposes only—use key vault or SSH in production

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
```

### 2. `variables.tf`

```hcl
variable "location" {
  default = "East US"
}

variable "vm_size" {
  default = "Standard_B1s"
}
```

### 3. `outputs.tf`

```hcl
output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}

output "public_ip" {
  value = azurerm_linux_virtual_machine.vm.public_ip_address
}
```

---

## ⚙️ Step 3: Initialize Terraform

```bash
terraform init
```

---

## 📊 Step 4: Plan the Deployment

```bash
terraform plan
```

---

## 🚀 Step 5: Apply the Configuration

```bash
terraform apply
```

Type `yes` when prompted.

---

## 🔍 Step 6: Verify the Azure VM

- Go to [Azure Portal](https://portal.azure.com)
- Navigate to Resource Groups → `rg-terraform-vm`
- Confirm VM, NIC, and networking resources are provisioned

---

## 🧼 Step 7: Clean Up (Destroy the Resources)

```bash
terraform destroy
```

Type `yes` to confirm.

---

## 📝 Future Improvements

- Use SSH keys for authentication instead of passwords
- Add a public IP resource and associate with NIC
- Use `azurerm_network_security_group` for fine-grained access
- Add tags and custom DNS
- Use `terraform.tfvars` or remote backend (e.g., Azure Storage) for state management

---
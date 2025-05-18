### **VirtualBox CLI Provisioning (Debian 12.10, Unattended Install)**

Using VirtualBox’s CLI (`VBoxManage`) enables automated provisioning of **Debian 12.10** with a **bridged network adapter**, **preconfigured SSH access**, and **unattended installation**.

---

## **1. Create the Virtual Machine**
Run this command to define a new VM:

```bash
VBoxManage createvm --name "DebianServer" --ostype Debian_64 --register
```

---

## **2. Configure VM Settings**
Set up the memory, CPU, and network:

```bash
VBoxManage modifyvm "DebianServer" --memory 2048 --cpus 2
VBoxManage modifyvm "DebianServer" --nic1 bridged --bridgeadapter1 enp3s0
```
*(Replace `enp3s0` with your actual network interface name.)*

---

## **3. Define Storage**
Create and attach a virtual disk:

```bash
VBoxManage createmedium disk --filename DebianServer.vdi --size 20000 --format VDI
VBoxManage storagectl "DebianServer" --name "SATA Controller" --add sata
VBoxManage storageattach "DebianServer" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium DebianServer.vdi
```

---

## **4. Attach Installation ISO**
Download **Debian 12.10** and link it:

```bash
VBoxManage storageattach "DebianServer" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ~/Downloads/debian-12.10.0-amd64-DVD-1.iso
```

---

## **5. Automate OS Installation (Unattended)**
VirtualBox allows **unattended Debian installations** using its built-in automation. Execute:

```bash
VBoxManage unattended install "DebianServer" \
    --iso=Downloads/debian-12.10.0-amd64-DVD-1.iso \
    --user=pjmaas \
    --password="secret" \
    --hostname=debian-server.local \
    --install-additions \
    --locale=en_US \
    --time-zone=UTC
```

**✅ What This Does:**

* Fully automates the Debian installation
* Creates user `pjmaas` with preconfigured password
* Sets locale, timezone, and hostname automatically

---

## **6. Configure SSH Access via Cloud-Init**
Debian supports cloud-init, so once the OS is installed, follow these steps.

### **Install Cloud-Init Tools**
```bash
sudo apt update
sudo apt install cloud-init cloud-image-utils -y
```

### **Create Cloud-Init User Data File**
```yaml
#cloud-config
hostname: debian-server
users:
  - name: myuser
    ssh_authorized_keys:
      - ssh-ed25519 AAAAB3NzaC1yc2EAAAADAQABAAABAQ...your_public_key_here...
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    groups: sudo
```

### **Generate the Cloud-Init ISO**
```bash
cloud-localds cloud-init.iso user-data
```

---

## **7. Attach Cloud-Init ISO**
Mount the generated Cloud-Init ISO:

```bash
VBoxManage storageattach "DebianServer" --storagectl "SATA Controller" --port 2 --device 0 --type dvddrive --medium cloud-init.iso
```

Start the VM to apply configurations:
```bash
VBoxManage startvm "DebianServer" --type headless
```

---

## **8. Boot the VM & Connect via SSH**
Find the VM’s IP address:

```bash
VBoxManage guestproperty get "DebianServer" "/VirtualBox/GuestInfo/Net/0/V4/IP"
```

Then SSH into the VM:

```bash
ssh myuser@VM_IP
```

---

## **9. (Optional) Harden SSH Security**
Disable password authentication for added security:

```bash
sudo sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

---

### **Final Steps**
✅ **Fully automated Debian install (no manual steps!)**  
✅ **Cloud-init applies user configurations**  
✅ **SSH access is enabled**  

This should give you a **completely unattended installation** without needing a GUI or manual intervention. Let me know if you’d like refinements! 🚀

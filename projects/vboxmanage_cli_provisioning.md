# **VBoxManage CLI Provisioning**

Using VirtualBox’s CLI (`VBoxManage`) gives you fine-grained control over VM deployment. Here’s a structured approach to provision an Ubuntu Server with a bridged network adapter and preconfigured SSH access.

## **1. Create the Virtual Machine**
Run this command to define a new VM:

```bash
VBoxManage createvm --name "UbuntuServer" --ostype Ubuntu_64 --register
```

## **2. Configure VM Settings**
Set up the memory and CPU:

```bash
VBoxManage modifyvm "UbuntuServer" --memory 2048 --cpus 2
```

Enable the bridged adapter:

```bash
VBoxManage modifyvm "UbuntuServer" --nic1 bridged --bridgeadapter1 enp3s0
```
*(Replace `enp3s0` with your actual network interface name.)*

## **3. Define Storage**
Create and attach a virtual disk:

```bash
VBoxManage createmedium disk --filename UbuntuServer.vdi --size 20000 --format VDI
VBoxManage storagectl "UbuntuServer" --name "SATA Controller" --add sata
VBoxManage storageattach "UbuntuServer" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium UbuntuServer.vdi
```

## **4. Attach Installation ISO**
Download Ubuntu Server ISO and link it:

```bash
VBoxManage storageattach "UbuntuServer" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium /path/to/ubuntu.iso
```

## **5. Preconfigure User Credentials & SSH**
To ensure SSH access without opening a GUI, use **Cloud-Init**.

You can generate a Cloud-Init ISO using the `cloud-localds` command, which is part of the `cloud-init` package. Here’s how you can do it:

**Install `cloud-init` Tools**:
If you don’t already have Cloud-Init installed, install `cloud-init` and `genisoimage` (for ISO creation):

```bash
sudo apt update
sudo apt install cloud-init genisoimage -y
```

### **Create a Cloud-Init User Data File**
Create a file named `user-data`:

```yaml
#cloud-config
hostname: ubuntu-server
users:
  - name: myuser
    lock_passwd: false
    passwd: $6$rounds=4096$salt$hashedpassword
    ssh_authorized_keys:
      - ssh-rsa AAAA...your_public_key_here...
```

### **Generate the Cloud-Init ISO**
Run this command to create an ISO file:

```bash
cloud-localds cloud-init.iso user-data
```

### Attach the ISO to Your Virtual Machine**
Use the `VBoxManage` command to attach the ISO:

```bash
VBoxManage storageattach "UbuntuServer" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium cloud-init.iso
```

### **5. Boot the VM with Cloud-Init Applied**
Start your VM in headless mode:

```bash
VBoxManage startvm "UbuntuServer" --type headless
```

## **7. Connect via SSH**
Find the VM’s IP address:

```bash
VBoxManage guestproperty get "UbuntuServer" "/VirtualBox/GuestInfo/Net/0/V4/IP"
```

Then SSH into the VM from your host machine:

```bash
ssh myuser@VM_IP
```

---

This setup ensures that SSH access is available as soon as the VM boots without needing GUI interaction.

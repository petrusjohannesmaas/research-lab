# VBoxManage CLI Provisioning

Using VirtualBox’s CLI (`VBoxManage`) gives you fine-grained control over VM deployment. Here’s a structured approach to provision an Ubuntu Server with a bridged network adapter:

### **1. Create the Virtual Machine**
Run this command to define a new VM:

```bash
VBoxManage createvm --name "UbuntuServer" --ostype Ubuntu_64 --register
```

### **2. Configure VM Settings**
Set up the memory and CPU:

```bash
VBoxManage modifyvm "UbuntuServer" --memory 2048 --cpus 2
```

Enable the bridged adapter:

```bash
VBoxManage modifyvm "UbuntuServer" --nic1 bridged --bridgeadapter1 enp3s0
```
*(Replace `enp3s0` with your actual network interface name.)*

### **3. Define Storage**
Create and attach a virtual disk:

```bash
VBoxManage createmedium disk --filename UbuntuServer.vdi --size 20000 --format VDI
VBoxManage storagectl "UbuntuServer" --name "SATA Controller" --add sata
VBoxManage storageattach "UbuntuServer" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium UbuntuServer.vdi
```

### **4. Attach Installation ISO**
Download Ubuntu Server ISO and link it:

```bash
VBoxManage storageattach "UbuntuServer" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium /path/to/ubuntu.iso
```

### **5. Boot VM for Installation**
Start the VM in headless mode:

```bash
VBoxManage startvm "UbuntuServer" --type headless
```

Now, you can access the VM via VirtualBox’s GUI or SSH once the network is configured correctly. After installation, eject the ISO and reboot:

```bash
VBoxManage storageattach "UbuntuServer" --storagectl "SATA Controller" --port 1 --device 0 --medium none
VBoxManage controlvm "UbuntuServer" reset
```

Would you like help configuring the Ubuntu server once it's up and running? I can walk you through network settings, SSH setup, or automation strategies!
# K3S Cluster on openSUSE MicroOS

K3s is a CNCF sandbox project that delivers a lightweight certified Kubernetes distribution created by Rancher Labs / openSUSE. K3s is highly available and production-ready. It has a very small binary size and very low resource requirements. In simple terms: it is Kubernetes without the bloat.

Source: [openSUSE documentation](https://en.opensuse.org/SDB:K3s_cluster_deployment_on_MicroOS)

MicroOS is a Micro Service OS developed built by the openSUSE community. It's designed to host container workloads with automated administration & patching. Installing openSUSE MicroOS you get a quick, small environment for deploying Containers, or any other workload that benefits from Transactional Updates. As 
rolling release distribution the software is always up-to-date.

Learn more about MicroOS: https://microos.opensuse.org/ 
Learn more about CNCF: https://www.cncf.io/

## Stage 1: Testing

### Host Configuration
My available hardware is an old iMac that a friend donated to my research. I am going to be installing the old faithful Debian as the host operating system for doing my initial testing, because I am used to the developer experience. 

I will be installing the GNOME desktop environment, which is the default for both Debian, and many openSUSE Linux distributions. GNOME is notoriously bloated, but this decision is made to ease my transition to a full openSUSE development setup once testing is finished. Also, I think GNOME looks really good.

You can download the Debian image here: https://www.debian.org/distrib/

Here's my setup post installation.

**`debian-mac`**

```
OS: Debian GNU/Linux 12 (Bookworm) x86_64
Host: iMac 11,2 1.0
Kernel: 6.1.0-34-amd64
DE: GNOME 43.9
CPU: Intel i3 550 (4) @ 3.192GHz
GPU: AMD ATI Mobility Radeon HD 5730 / 6570M
Memory: 7930MiB
```
A simple test is to check HTOP for resource usage as the process goes along.

```shell
sudo apt install htop
```

* **Idle load average**: 0.23
* **RAM usage** 1.18GB

(Running GNOME Terminal + VirtualBox as the only active application)

### Virtualization

KVM (Kernel-based Virtual Machine) is a type 1 hypervisor that runs directly on the host hardware, offering better performance and scalability, while VirtualBox is a type 2 hypervisor that runs on top of an existing operating system, making it easier to set up but potentially less efficient. 

I'm using VirtualBox, because I'll be using the pre-packaged MicroOS `.vdi` files provided by openSUSE to save some time on installations while testing. Also, because of some locational limitations, I can only use WiFi at this stage of the process and I'll go into more detail as to why this is a determining factor in my testing infrastructure in the next step.

Download the `.vdi` file here: https://en.opensuse.org/Portal:MicroOS/Downloads 

I learned the hard way that if you try to reuse the `.vdi` file to configure multiple virtual machines, VirtualBox will give you errors saying that the UUID for it has already been registered. To avoid this, make sure to clone the base `.vdi` file before creating your first VM. This will also keep your base file clean. To do this I ran this command:

```shell
VBoxManage clonehd base.vdi your-first-clone.vdi --format VDI
```

✅ This creates your-first-clone.vdi with a unique UUID, so it won’t conflict with the original or with any subsequent `.vdi`'s.

**Virtual Machines**

`suse-server` (Control plane)
* 2 core
* 2048MB RAM
* 20GB storage

`suse-agent` (Worker node)
* 1 core
* 1024MB RAM
* 20GB storage

Now I just complete the installation process for each on VirtualBox's built in preview, setting passwords and timezones.

* **Idle load average w/ VMs**: 0.3
* **RAM usage w/ VMs**: 2.7GB 

### Networking  

Right now when we try to ping our virtual machines, they are unreachable. This is because the default network adapter is attached to NAT. In order for our virtual machines to get IP addresses from our DHCP server we need to set up a bridged adapter. 

As I said in the previous section, I chose VirtualBox because of hardware / locational issues. KVM/QEMU does not allow you configure Bridges on WiFi networks. This is a quote from the [Bridged Networking](https://www.virtualbox.org/manual/topics/networkingdetails.html#network_bridged) section from the VirtualBox documentation:

```
With bridged networking, Oracle VirtualBox uses a device driver on your host system that filters data from your physical network adapter. This driver is therefore called a net filter driver. This enables Oracle VirtualBox to intercept data from the physical network and inject data into it, effectively creating a new network interface in software. When a guest is using such a new software interface, it looks to the host system as though the guest were physically connected to the interface using a network cable. The host can send data to the guest through that interface and receive data from it. This means that you can set up routing or bridging between the guest and the rest of your network.
```

Once the `Bridged Adapter` mode is selected on each VM, I can get the IP addresses by running the `ip a` command on each VM for configuring them in an SSH client in the next step.

The last networking configuration needed for testing is to make sure that each VM has a unique hostname. K3S Requires that all nodes have unique hostnames. You can set it on each using this command:

```shell
ip a # To get the IP address for SSH
sudo hostnamectl set-hostname my-hostname --static --transient
```

### Transactional updates in MicroOS

MicroOS ensures stability with a **read-only root file system**, preventing direct modifications. Instead, it uses **transactional updates** to create **snapshots** before applying changes, allowing easy **rollback** if needed. This is ideal for backing up my VM configurations before continuing.

Each update generates a new snapshot, requiring a **reboot** to apply. This approach protects against unintended changes, ensuring a **safer, more reliable** installation.

Learn more: [Transactional Updates Documentation](https://documentation.suse.com/smart/systems-management/html/Micro-transactional-updates/index.html)

To install K3S the VM's are going to need the `curl` package. After it's installed, I can restart in headless mode, so that I can SSH into the VMs and configure them individually from my Debian terminal. 

```shell
sudo transactional-update pkg install curl
```

Now the fun begins!

### `suse-server` configuration 

In K3S the control-plane node is referred to as the "server" node. Let's run the server install script:

```shell
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --cluster-init --write-kubeconfig-mode=644" sh -
```

A reboot is required. **After reboot** wait a few minutes and run this command to check if the control-plane is running.

```shell
kubectl get nodes
```

If you are seeing some funky output, check the status of your k3s server by running:

```shell
sudo systemctl status k3s
```

To connect agents or servers to cluster you need the server token. 

```shell
sudo cat /var/lib/rancher/k3s/server/node-token
```

I am going to use it to configure the agent next.

### `suse-agent` configuration

In K3S the worker node is referred to as the "agent" node. SSH into the `suse-agent` and run the agent install script:

```shell
curl -sfL https://get.k3s.io | K3S_URL="https://<SUSE-SERVER-IP>:6443" K3S_TOKEN="<SERVER-TOKEN>" K3S_KUBECONFIG_MODE="644" sh -
```
A reboot is required. The Kubernetes cluster is not managed on the agent, so the `kubectl` command won't work. **After reboot** wait a few minutes + if you want to check on its status you have to run the following:

```shell
sudo systemctl status k3s-agent
``` 

### Cluster status check
To confirm that our agent has successfully joined our cluster, I am going to run the following command on `suse-server`:

```shell
kubectl get nodes
```

`suse-agent` should now appear in the list with a status of `Ready`.

* **Idle cluster load average**: 2.89
* **RAM usage** 4.9GB

This concludes the initial testing phase. All that's left to do is to deploy containers to the cluster. For that, I'm going to need an image!

---

### Image repository

Have a look at my [Air Gapped Container Registry Image Registry](https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/airgapped_container_image_registry.md) project to set up a self hosted image registry for your container builds.


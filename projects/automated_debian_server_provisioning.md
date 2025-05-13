# Automated Debian Server Provisioning (with Ansible)

### Overview
I came across an article by [Henning](https://nerdyarticles.com/author/henning/) on how he configures and hardens his Debian server. In this project, I'll use his article as **inspiration** and set up Ansible to automate some of these processes, but add some of my own like installing a container runtime and a resource monitoring tool, logging and brute force detection.

**Reference article**: https://nerdyarticles.com/debian-server-essentials-setup-configure-and-hardening-your-system/

I'll be using my development machine as the "control node" where Ansible runs and configure a virtual machine (VM) with Debian installed as the "managed node".

**Future improvements**:
* TODO: Handle privileges better from the installation process
* TODO: Implement Monit into the playbook
* TODO: Implement fail2ban into the playbook

---

### Virtual machine setup

* OS: [Debian 12.10.0](https://www.debian.org/distrib/)
* CPU: 1 core
* RAM: 2GB
* Disk: 10GB
* Network: Bridged Adapter mode

The **managed node** (the machine that Ansible is managing) does not require Ansible to be installed, but requires Python to run Ansible-generated Python code.

Make sure Python is installed on the system by running:

```bash
python3 --version
```

This would be a good time to clone your VM for future use. I am using **VirtualBox**:

```shell
VBoxManage clonehd /path/to/your.vdi /path/to/cloned.vdi --format VDI
```

#### User accounts & privileges

 The managed node also needs a user account that can connect through SSH to the node with an interactive POSIX shell.

The minimal Debian installation doesn't install `sudo` package. Log in as root and install it:

```bash
su -
apt install sudo
```

Add your user to the `sudo` group:

```bash
usermod -aG sudo your_user
```

⚠️ Reboot after making these changes.

#### Networking

I might automate this process with Ansible in the future, but I am going to configure a **static IP address** on the Debian server (VM) by modifying the network settings manually for now. 

Get the interface name by running:
```bash
ip a 
```

Open network settings:
```bash
sudo vi /etc/network/interfaces
```

For a **static IP setup**, replace the primary interface block with this:
```ini
auto enp0s3
iface enp0s3 inet static
    address <YOUR-IP>
    netmask 255.255.255.0
    gateway <YOUR-GATEWAY>
    dns-nameservers 8.8.8.8 8.8.4.4
```
- Replace `enp0s3` with your actual interface name.
- Adjust `address`, `gateway`, and DNS as needed.

Restart networking:
```bash
sudo systemctl restart networking
```

Or, manually bring the interface down and up:
```bash
sudo ip link set enp0s3 down
sudo ip link set enp0s3 up
```

Verify with:
```bash
ip a
```

Try pinging a public IP:
```bash
ping 8.8.8.8 -c 4
```

If everything works, the server now has a **persistent static IP**.

#### Configure SSH

With my initial testing, I got a **sudo password** issue when trying to run playbooks. That happens because Ansible **doesn't know how to escalate privileges** when using `become: true`. You need to explicitly tell it **how to use sudo** in your playbook or command.

```bash
ansible-playbook your-playbook.yml --ask-become-pass
```

This will prompt you for the sudo password before executing privileged tasks, but there is a better way to do this.

👾 **Best Practice:** Use SSH Keys + Passwordless Sudo

Grant `your-user` passwordless sudo privileges by modifying:

```bash
sudo visudo
```

Add this line at the bottom:
```
your_user ALL=(ALL) NOPASSWD: ALL
```

I'll generate an SSH key on my host system:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Add the SSH key to the server by running this command:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub your_vm_user@192.168.56.101
```

---

### Installing Ansible

For the control node (the machine that runs Ansible), you can use nearly any UNIX-like machine with Python installed. This includes Red Hat, Debian, Ubuntu, macOS, BSDs, and Windows under a Windows Subsystem for Linux (WSL) distribution.

**Ansible community installation guide:** [Click here](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#control-node-requirements)

On some systems, it may not be possible to install Ansible with pip, due to decisions made by the operating system developers. In such cases, pipx is a widely available alternative.

`pip` is a general-purpose package installer for both libraries and apps with no environment isolation. `pipx` is made specifically for application installation, as it adds isolation yet still makes the apps available in your shell. `pipx` creates an isolated environment for each application and its associated packages.

Before installing Ansible, I'm going to have to install `pipx` and other required dependencies:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install pipx
pipx ensurepath
sudo pipx ensurepath --global # optional to allow pipx actions with --global argument
```

Now, let's install Ansible using `pipx`. This will give you the latest version.

```bash
pipx install --include-deps ansible
```

To install additional `python` dependencies that may be needed, with the example of installing the `argcomplete` python package as described below:

```bash
pipx inject ansible argcomplete
```

Include the `--include-apps` option to make apps in the additional python dependency available on your **PATH**. This allows you to execute commands for those apps from the shell.

```bash
pipx inject --include-apps ansible argcomplete
```

To upgrade Ansible to the latest version:

```bash
pipx upgrade --include-injected ansible 
```

Check if Ansible was installed successfully by running:

```bash
ansible --version
```

You should see output similar to:

```bash
ansible 2.x.x
  config file = /home/your_user/.ansible.cfg
  configured module search path = ['/home/your_user/.ansible/plugins/modules']
  ansible python module location = /home/your_user/.local/lib/python3.x/site-packages/ansible
```

#### Configure Ansible

Ansible requires a few configurations, particularly an **inventory file** that tells Ansible where the hosts (your virtual machines) are located.

Let’s create the directory for Ansible to work in:

```bash
mkdir -p ~/ansible_project
cd ~/ansible_project
```

Create an inventory file that will list the hosts you want to manage (i.e., the Debian VM). Create a file named `hosts.ini`:

```bash
touch hosts.ini
```

Replace `your_vm_user` with the username you’ll be using to connect to the server. It'll have to be a user with `sudo` privileges) and specify an SSH key:

```ini
[debian_vms]
192.168.56.101 ansible_user=your_vm_user ansible_ssh_private_key_file=/path/to/your/private_key
```

It’s a good practice to create a default Ansible configuration file (`ansible.cfg`) to define settings that control how Ansible behaves. This is optional but helpful for my setup:

```bash
touch ansible.cfg
```

Edit `ansible.cfg`:

```ini
[defaults]
inventory = ./hosts.ini
```

🤞 **You should now be able to test connectivity to your VM from your control node.**

Run this command to check if Ansible can connect to your VM.:

```bash
ansible all -m ping
```

You'll be prompted for a passphrase. If you want **extra security**, set one when creating your host SSH key; otherwise, just press Enter.

If everything is set up correctly, you should see a `pong` response from your VM:

```bash
192.168.56.101 | SUCCESS | rc=0 >>
pong
```

If not, check the SSH configuration or any firewall settings.

#### Create and Run Your First Playbook

Now that Ansible is installed and my VM is set up as a managed node, let's create a simple playbook to **update the system**, and **install Podman**.

Create a new file called `setup.yml`:

```bash
touch setup.yml
```

Edit it with your text editor:

```yaml
- name: Update and Install Packages on Debian VM
  hosts: debian_vms
  become: true
  tasks:
    - name: Update apt repository
      apt:
        update_cache: yes

    - name: Upgrade all packages
      apt:
        upgrade: dist

    - name: Install Podman
      apt:
        name: podman
        state: present

    - name: Ensure registry config exists
      file:
        path: /etc/containers/registries.conf
        state: touch
        mode: '0644'

    - name: Configure Podman registry search
      blockinfile:
        path: /etc/containers/registries.conf
        marker: "# ANSIBLE MANAGED BLOCK"
        block: |
          [[registry]]
          unqualified-search-registries = ["docker.io"]
      notify: Restart Podman

  handlers:
    - name: Restart Podman
      service:
        name: podman
        state: restarted
```

### **What This Does:**
1. Update the APT repositories.
2. Upgrade all installed packages.
3. Install `podman`.
4. Ensures **`/etc/containers/registries.conf`** exists (avoiding errors).
5. Uses `blockinfile` to insert or update the **registry search settings**.
6. Includes a handler to restart Podman when changes are made.

This will make sure Podman searches **Docker Hub** when pulling unqualified images.

**Note:** If you are running the Podman in rootless mode, you might have to add the registry in a different location:

```sh
mkdir -p $HOME/.config/containers
vi $HOME/.config/containers/registries.conf
```

#### ⛳ Run the playbook

Now, run the playbook with the following command:

```bash
ansible-playbook setup.yml
```

Ansible will go through the tasks and execute them on your server. If everything works, you should see the packages being installed.

After the playbook finishes, you can verify that `podman` is installed:

```bash
podman --version
```

🥳 **Congrats, you have automated your first tasks with Ansible! Check back here in the future for a more complex configuration.**

## Troubleshooting

Debian’s **offline installer** adds the installation media (CD/DVD/ISO) as an apt source, causing `apt` to prompt for it. You can fix this by **removing the CD-ROM entry from your APT sources**.

### **Solution: Disable CD-ROM as a Package Source**

**Check Your Current APT Sources**

```bash
cat /etc/apt/sources.list
```

If you see something like: `deb cdrom:[Debian GNU/Linux ...] / contrib main`

```bash
sudo nano /etc/apt/sources.list
```

Locate the **`deb cdrom`** entry and comment it out by adding a `#` at the beginning:

```
# deb cdrom:[Debian GNU/Linux ...] / contrib main
```

Add Online Debian Mirrors If they are missing:

```
deb http://deb.debian.org/debian stable main contrib non-free
deb http://security.debian.org/debian-security stable-security main contrib non-free
```

Refresh your package lists:

```bash
sudo apt update
```

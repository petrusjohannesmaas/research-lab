# Microsoft Azure CI/CD Pipeline with Jenkins

In this article, I document my end-to-end journey of deploying a Python web application to an Azure Virtual Machine using Jenkins. My goal was to explore the practical steps involved in integrating the Azure CLI with Jenkins pipelines and container workflows—from initial provisioning to final deployment.

**To achieve this, I broke the process into five focused tasks:**

1. Provision the most cost-effective Azure VM via the CLI and validate SSH connectivity from my local machine.
2. Set up a simple Jenkins pipeline using a `Jenkinsfile` to understand the structure of a CI/CD workflow.
3. Build a lightweight Python “Hello World” app that returns a JSON response from the root endpoint.
4. Containerize the app and push the image to Azure Container Registry (ACR) from my local environment.
5. Use Jenkins to automate cloning, testing, packaging, and deploying the container to the VM, ultimately verifying the deployment with a simple `curl` request.

Whether you're refining your CI/CD skills or exploring Azure for the first time, this walkthrough will offer a grounded, reproducible path to deploying your first containerized app using Jenkins and the Azure CLI, but before we get started we need to install Azure CLI.

### 🛠️ **Install Azure CLI on Debian**

1. **Update your package index:**
    
    ```bash
    sudo apt update
    ```
    
2. **Install prerequisites:**
    
    ```bash
    sudo apt install ca-certificates curl apt-transport-https lsb-release gnupg
    ```
    
3. **Add the Microsoft signing key:**
    
    ```bash
    curl -sL <https://packages.microsoft.com/keys/microsoft.asc> | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/microsoft.gpg
    ```
    
4. **Add the Azure CLI software repository:**
    
    ```bash
    echo "deb [arch=amd64] <https://packages.microsoft.com/repos/azure-cli/> $(lsb_release -cs) main" | \\
    sudo tee /etc/apt/sources.list.d/azure-cli.list
    ```
    
5. **Update again and install:**
    
    ```bash
    sudo apt update
    sudo apt install azure-cli
    ```
    
6. **Once installed, verify it with:**
    
    ```json
    az version
    ```
    

### ✅ **Step 1: Provision the Cheapest Azure VM with CLI (Manual SSH Test)**

```bash
# Log in first
az login

# Create a resource group
az group create --name testResourceGroup --location southafricanorth

# Create the smallest Linux VM
az vm create \
  --resource-group testResourceGroup \
  --name devJenkinsVM \
  --image Debian:debian-12:12-gen2:latest \
  --admin-username azureuser \
  --generate-ssh-keys \
  --size Standard_B1s \
  --authentication-type ssh
```

You should get a response similar to this:

```json
{
  "fqdns": "",
  "id": "/subscriptions/<your-id>/resourceGroups/testResourceGroup/providers/Microsoft.Compute/virtualMachines/devJenkinsVM",
  "location": "southafricanorth",
  "macAddress": "<your-mac-address>",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "<your-public-ip>",
  "resourceGroup": "testResourceGroup",
  "zones": ""
}
```

If you cleared this, you can retrieve your networking details (you’ll need this for the next step):

```bash
az vm list-ip-addresses \
  --resource-group testResourceGroup \
  --name devJenkinsVM \
  --output table
```

Then:

```bash
# Open SSH port if not already
az vm open-port \
--port 22 \
--resource-group testResourceGroup\
--name devJenkinsVM

# Connect to it
ssh azureuser@<public-ip>
```

For a security measure you can protect your VM by only allowing key based authentication:

```json
az vm user update \
  --resource-group testResourceGroup \
  --name devJenkinsVM \
  --username azureuser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

## 🖥 Pro tip: Hardening the server

Let’s lock it down smartly while keeping just enough open for your Jenkins pipeline, SSH access, and local testing via `curl`. Since there are no current firewall rules, we’ll define a clean set using a **Network Security Group (NSG)**. Once you’ve done this you can be confident that you won’t have any bad actors messing with your VM while you’re testing.

### **Create a Network Security Group (if not already created):**

```bash
az network nsg create \
--resource-group testResourceGroup \
--name testNSG \
--location southafricanorth
```

First, find your NIC name:

```bash
az vm show \
 --resource-group testResourceGroup \
 --name devJenkinsVM \
 --query "networkProfile.networkInterfaces[0].id" \
 --output tsv
```

This will return something like: (The last part—`devJenkinsVMVMNic`—is your NIC name.)

```json
/subscriptions/xxxx/resourceGroups/testResourceGroup/providers/Microsoft.Network/networkInterfaces/devJenkinsVMVMNic
```

Extract the NIC name from the last part of the ID, then associate the NSG with Your VM’s Network Interface:

```bash
az network nic update \
--name <your-nic-name> \
--resource-group testResourceGroup \
--network-security-group testNSG
```

### Allow SSH (Port 22) from Your IP:

If you haven't already checked your public IP, just run:

```json
curl https://api.ipify.org
```

Create a new NSG rule for SSH:

```bash
az network nsg rule create \
  --resource-group testResourceGroup \
  --nsg-name testNSG \
  --name AllowSSH \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-range 22 \
  --source-address-prefixes <YOUR-IP>/32
```

### Allow Flask App Port (e.g., 5000) from Your IP:

```bash
az network nsg rule create \
  --resource-group testResourceGroup \
  --nsg-name testNSG \
  --name AllowFlask \
  --priority 110 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-range 5000 \
  --source-address-prefixes <YOUR-IP>/32
```

### Deny All Other Inbound Traffic (Optional but Recommended):

```bash
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name testNSG \
  --name DenyAllInbound \
  --priority 2000 \
  --direction Inbound \
  --access Deny \
  --protocol '*' \
  --source-address-prefixes '*' \
  --destination-port-ranges '*'
```

This setup ensures:

- Only **you** (from your IP) can SSH or `curl` the Flask app.
- Jenkins can deploy if it runs from your machine or uses the same IP.
- Everything else is blocked.

**Important: Your public IP might be dynamic and change unless you’ve configured it to be static through your ISP, so you might have to revise these rules if your connection isn’t working anymore.**

### 🔁 **Step 2: Learn Jenkins Pipelines with a Minimal Jenkinsfile**

Here’s a simple example for local experimentation:

```groovy
pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git '<https://github.com/><your-username>/<your-repo>.git'
            }
        }
        stage('Build') {
            steps {
                sh 'echo "Build step"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Test step"'
            }
        }
        stage('Package') {
            steps {
                sh 'echo "Packaging..."'
            }
        }
    }
}
```

You can check out this in depth tutorial on how to install and troubleshoot Jenkins pipelines: https://www.youtube.com/watch?v=6YZvp2GwT0A

Once that feels comfortable, you’ll extend this later in step 5.

### 🐍 **Step 3: Create a Hello World Python App with JSON Response**

Minimal Flask app:

```python
# app.py
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify(message='Hello, Azure!')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

`requirements.txt`:

```
flask
```

Create a Dockerfile:

```docker
# Use an official Python image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependencies first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code
COPY app.py .

# Expose the port Flask listens on
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
```

Build the image:

```bash
docker build -t test-python-app .
```

### 📦 **Step 4: Push to Azure Container Registry (ACR)**

If your Azure subscription hasn’t been registered to use the **Microsoft.ContainerRegistry** resource provider yet—which is required to create an Azure Container Registry (ACR). 

**Register the provider via Azure CLI:**

```bash
az provider register --namespace Microsoft.ContainerRegistry
```

Then you can check the registration status with:

```bash
az provider show --namespace Microsoft.ContainerRegistry --query "registrationState"
```

Once it returns `"Registered"`, you’re good to run your `az acr create` command.

```bash
# Create ACR
az acr create \
--resource-group testResourceGroup \
--name <YOUR-REGISTRY-NAME> \
--sku Basic \
--admin-enabled true
```

Now, Log in to your registry and push the image:

```bash
# Log in to ACR
az acr login --name <YOUR-REGISTRY-NAME>

# Tag and push image
docker tag test-python-app <YOUR-REGISTRY-NAME>.azurecr.io/test-python-app:latest
docker push <YOUR-REGISTRY-NAME>.azurecr.io/test-python-app:latest
```

You can confirm the image is available by running:

```bash
az acr repository list --name <YOUR-REGISTRY-NAME> --output table
```

Get detailed information about the image:

```bash
az acr manifest list-metadata --name test-python-app --registry <YOUR-REGISTRY-NAME> --output table
```

### ⚙️ **Step 5: Jenkinsfile for Full CI/CD Using ACR + Azure VM**

Here’s how that might look:

```groovy
pipeline {
    agent any

    environment {
        IMAGE = '<YOUR-REGISTRY-NAME>.azurecr.io/my-python-app:latest'
        DEPLOY_HOST = 'your.azure.vm.ip'
        DEPLOY_USER = 'azureuser'
        SSH_KEY_ID = 'your-ssh-cred-id'
    }

    stages {
        stage('Clone') {
            steps {
                git '<https://github.com/><your-user>/<your-flask-repo>.git'
            }
        }

        stage('Build & Test') {
            steps {
                sh 'docker build -t $IMAGE .'
                sh 'docker run --rm $IMAGE python -c "import flask"' // sanity check
            }
        }

        stage('Push to ACR') {
            steps {
                sh 'az acr login --name mycontainerreg'
                sh 'docker push $IMAGE'
            }
        }

        stage('Deploy') {
            steps {
                sshagent([SSH_KEY_ID]) {
                    sh '''
                    ssh $DEPLOY_USER@$DEPLOY_HOST '
                        docker pull $IMAGE &&
                        docker stop myapp || true &&
                        docker rm myapp || true &&
                        docker run -d -p 80:5000 --name myapp $IMAGE
                    '
                    '''
                }
            }
        }
    }
}

```

Once that’s deployed, from your local machine:

```bash
curl http://<your-vm-ip>/
# Should return: {"message": "Hello, Azure!"}
```

### 🔧☁️🐳 Future improvements:

- Securely injecting the ACR credentials into Jenkins
- Pipeline notifications,
- Health checks,
- VM teardown automation.
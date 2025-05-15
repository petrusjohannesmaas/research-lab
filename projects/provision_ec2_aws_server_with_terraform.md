# Provision an EC2 AWS Server (w/ Terraform)

### ✅ Prerequisites

* AWS account
* IAM user with programmatic access and permissions to create EC2 resources
* AWS CLI installed and configured (`aws configure`)
* Terraform installed ([Install guide](https://developer.hashicorp.com/terraform/downloads))
* Basic terminal/command line knowledge

---

## 🛠 Step 1: Create Project Directory

```bash
mkdir terraform-ec2
cd terraform-ec2
```

---

## 📄 Step 2: Create Terraform Files

### 1. `main.tf`

```hcl
provider "aws" {
  region = "us-east-1"  # or your preferred region
}

resource "aws_instance" "example" {
  ami           = "ami-0c02fb55956c7d316"  # Amazon Linux 2 AMI for us-east-1
  instance_type = "t2.micro"

  tags = {
    Name = "TerraformEC2"
  }
}
```

### 2. `variables.tf` (optional for customization)

```hcl
variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}
```

Update `main.tf` to use variables if using `variables.tf`:

```hcl
provider "aws" {
  region = var.region
}

resource "aws_instance" "example" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = var.instance_type

  tags = {
    Name = "TerraformEC2"
  }
}
```

### 3. `outputs.tf`

```hcl
output "instance_id" {
  value = aws_instance.example.id
}

output "public_ip" {
  value = aws_instance.example.public_ip
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

This previews what Terraform will do without applying changes.

---

## 🚀 Step 5: Apply the Configuration

```bash
terraform apply
```

Type `yes` when prompted.

---

## 🔍 Step 6: Verify the EC2 Instance

* Go to your AWS EC2 dashboard
* You should see the instance named `TerraformEC2` running
* Note the `Public IP` from Terraform output

---

## 🧼 Step 7: Clean Up (Destroy the Resources)

```bash
terraform destroy
```

Type `yes` to confirm.

---

## 📝 Future improvements:

* Key pairs for SSH access
* Security groups
* Elastic IPs
* User data scripts
* Using remote backends (e.g., S3 for state storage)
* Outputting connection strings

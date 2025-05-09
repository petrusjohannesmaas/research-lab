You can use **Terraform** to deploy an **API container** and a **frontend container** on an **AWS EC2 instance**. Here’s a simple approach:

### **Steps to Deploy API & Frontend Containers on EC2 Using Terraform**
1. **Define the AWS Provider**  
   ```hcl
   provider "aws" {
     region = "us-east-1"
   }
   ```

2. **Create an EC2 Instance**  
   ```hcl
   resource "aws_instance" "web_server" {
     ami           = "ami-12345678"  # Replace with a valid AMI ID
     instance_type = "t2.micro"
     key_name      = "my-key"

     user_data = <<-EOF
       #!/bin/bash
       sudo yum update -y
       sudo yum install docker -y
       sudo systemctl start docker
       sudo systemctl enable docker
       sudo docker run -d -p 5000:5000 my-api-container
       sudo docker run -d -p 80:80 my-frontend-container
     EOF

     tags = {
       Name = "Terraform-EC2-Containers"
     }
   }
   ```

3. **Define Security Groups**  
   ```hcl
   resource "aws_security_group" "allow_web" {
     name        = "allow_web"
     description = "Allow API and Web traffic"
     vpc_id      = aws_vpc.my_vpc.id

     ingress {
       from_port   = 80
       to_port     = 80
       protocol    = "tcp"
       cidr_blocks = ["0.0.0.0/0"]
     }

     ingress {
       from_port   = 5000
       to_port     = 5000
       protocol    = "tcp"
       cidr_blocks = ["0.0.0.0/0"]
     }
   }
   ```

4. **Initialize and Apply Terraform**  
   ```sh
   terraform init
   terraform apply -auto-approve
   ```

### **Outcome**
- Terraform provisions an **EC2 instance**.
- Installs **Docker** and runs **API & frontend containers**.
- Opens ports **80 (frontend)** and **5000 (API)** for access.

You can explore more details on [Terraform EC2 container deployment](https://dev.to/yash_sonawane25/deploying-an-ec2-instance-with-a-dockerized-app-using-terraform-3dp3) and [setting up backend/frontend infrastructure](https://cto.ai/blog/setting-up-a-backend-and-frontend-application-infrastructure-on-terraform/). Would you like help refining this setup? 🚀
# Define the provider


# Get current AWS account ID
data "aws_caller_identity" "current" {}

# Create a VPC
resource "aws_vpc" "my_vpc" {
  cidr_block           = "172.30.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "My VPC"
  }
}

# Create an Internet Gateway
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "My Internet Gateway"
  }
}

# Create a Route Table and route internet traffic
resource "aws_route_table" "my_route_table" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }

  tags = {
    Name = "My Route Table"
  }
}

# Associate the route table with the subnets
resource "aws_route_table_association" "my_route_table_assoc" {
  count          = 2
  subnet_id      = aws_subnet.my_subnet[count.index].id
  route_table_id = aws_route_table.my_route_table.id
}

# Create a Security Group for EC2 instance
resource "aws_security_group" "my_security_group" {
  vpc_id = aws_vpc.my_vpc.id

  # Allow inbound traffic on port 8080
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound traffic on port 80 (Frontend)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound traffic on port 3000 (Nginx and Frontend communication)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound SSH access on port 22
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "My EC2 Security Group"
  }
}

# Create subnets in each availability zone within the VPC
resource "aws_subnet" "my_subnet" {
  count             = 2 
  vpc_id            = aws_vpc.my_vpc.id
  cidr_block        = cidrsubnet(aws_vpc.my_vpc.cidr_block, 8, count.index)
  availability_zone = element(data.aws_availability_zones.available.names, count.index)
  map_public_ip_on_launch = true  

  tags = {
    Name = "My Subnet ${count.index + 1}"
  }
}

# Assign elastic IP to EC2
resource "aws_eip" "my_eip" {
  domain = "vpc"
}

resource "aws_eip_association" "my_eip_assoc" {
  instance_id   = aws_instance.my_instance.id
  allocation_id = aws_eip.my_eip.id
}

# Get available availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Create a DB subnet group using the created subnets
resource "aws_db_subnet_group" "my_db_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = aws_subnet.my_subnet[*].id 

  tags = {
    Name = "My DB Subnet Group"
  }
}

# Create an RDS database
resource "aws_db_instance" "diagnosemedbprod" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "16.3"
  instance_class       = "db.t3.micro"
  identifier           = "diagnosemedbprod"
  username             = "postgres"
  password             = "Diagnoseme"
  db_name              = "diagnosemedb_prod"
  publicly_accessible  = true
  db_subnet_group_name = aws_db_subnet_group.my_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  skip_final_snapshot  = true

  tags = {
    Name = "diagnosemedbprod"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.diagnosemedbprod.endpoint
}

# Create a security group for the RDS instance
resource "aws_security_group" "rds_security_group" {
  vpc_id = aws_vpc.my_vpc.id

  # Allow inbound traffic to the RDS instance on port 5432
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "RDS Security Group"
  }
}

# Allow EC2 instances to connect to the RDS security group
resource "aws_security_group_rule" "allow_ec2_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_security_group.id
  source_security_group_id = aws_security_group.my_security_group.id
}

# Create S3 bucket for storing .env.prod
resource "aws_s3_bucket" "my_env_prod_bucket" {
  bucket_prefix = "my-env-prod-bucket"

  tags = {
    Name = "Environment and Dockerfile Bucket"
  }
}

# Upload .env.prod file to S3
resource "aws_s3_object" "env_prod_object" {
  bucket = aws_s3_bucket.my_env_prod_bucket.bucket
  key    = "env.prod"
  source = "../.env.prod"
  acl    = "private"
}

# IAM Role for EC2 to access S3
resource "aws_iam_role" "ec2_s3_access_role" {
  name = "ec2_s3_access_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      }
    }
  ]
}
EOF
}

# Attach IAM policy to allow access to the S3 bucket and RDS
resource "aws_iam_policy" "ec2_rds_s3_access_policy" {
  name = "ec2_rds_s3_access_policy"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.my_env_prod_bucket.bucket}/*"
    },
    {
      "Effect": "Allow",
      "Action": "rds:DescribeDBInstances",
      "Resource": "*"
    }
  ]
}
EOF
}

# Attach IAM policy to EC2 role
resource "aws_iam_role_policy_attachment" "ec2_s3_access_attach" {
  role       = aws_iam_role.ec2_s3_access_role.name
  policy_arn = aws_iam_policy.ec2_rds_s3_access_policy.arn
}

# Create instance profile for EC2
resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2_s3_instance_profile"
  role = aws_iam_role.ec2_s3_access_role.name
}

# Update EC2 instance to use the Security Group and automatically deploy the backend
resource "aws_instance" "my_instance" {
  ami                    = "ami-0ae8f15ae66fe8cda"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.my_subnet[0].id
  vpc_security_group_ids = [aws_security_group.my_security_group.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name
  key_name               = "diagnoseme-be"

  # User data to automate Docker setup, S3 download, and backend deployment
  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install docker nginx aws-cli jq -y
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo systemctl start nginx
    sudo systemctl enable nginx

    # Fetch the RDS endpoint from Terraform output 
    RDS_HOST=$(aws rds describe-db-instances --db-instance-identifier diagnosemedbprod --query 'DBInstances[0].Endpoint.Address' --output text)

    echo "Fetched RDS_HOST: $RDS_HOST" >> /home/ec2-user/rds_host_log.txt

    # Check if the RDS_HOST is correctly fetched
    if [ -z "$RDS_HOST" ]; then
      echo "Error: RDS_HOST is empty or None!" >> /home/ec2-user/rds_host_log.txt
      exit 1 # Exit the script if RDS_HOST is empty
    fi

    # Download .env.prod from S3 and replace placeholders
    aws s3 cp s3://${aws_s3_bucket.my_env_prod_bucket.bucket}/env.prod /home/ec2-user/env.prod

    # sed -i "s|<RDS_HOST_ENDPOINT>|$RDS_HOST|g" /home/ec2-user/env.prod

    # Pull backend Docker image from Docker Hub
    docker pull richkitibwa/diagnoseme-be:latest

    # Pull frontend Docker image from Docker Hub
    docker pull richkitibwa/diagnoseme-fe:latest

    # Stop and remove any existing containers
    docker stop $(docker ps -aq) || true
    docker rm $(docker ps -aq) || true

    # Run backend Docker container using the downloaded .env.prod
    docker run -d --name diagnoseme-be --env-file /home/ec2-user/env.prod -p 8080:8080 richkitibwa/diagnoseme-be:latest

    # Run frontend container
    docker run -d --name diagnoseme-fe -p 3000:80 richkitibwa/diagnoseme-fe:latest

    # Configure Nginx for reverse proxy
    cat <<EOT > /etc/nginx/conf.d/app.conf
    server {
      listen 80;

      location / {
          proxy_pass http://localhost:3000;  # Route frontend requests
          proxy_set_header Host \$host;
          proxy_set_header X-Real-IP \$remote_addr;
          proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto \$scheme;
      }

      location /api/ {
          proxy_pass http://localhost:8080; # Route backend requests
          proxy_set_header Host \$host;
          proxy_set_header X-Real-IP \$remote_addr;
          proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto \$scheme;
      }
    }
    EOT

    # Restart Nginx to apply the new configuration
    sudo systemctl restart nginx

    # Create a systemd service to start the Docker container on reboot
    cat <<EOT >> /etc/systemd/system/docker-backend.service
    [Unit]
    Description=Docker Backend Service
    After=docker.service
    Requires=docker.service

    [Service]
    Restart=always
    ExecStart=/usr/bin/docker run --env-file /home/ec2-user/env.prod -p 8080:8080 richkitibwa/diagnoseme-be:latest

    [Install]
    WantedBy=multi-user.target
    EOT

    # Enable and start the Docker backend service
    sudo systemctl enable docker-backend.service
    sudo systemctl start docker-backend.service

  EOF

  tags = {
    Name = "diagnoseme-be"
  }
}

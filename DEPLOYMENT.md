# Shift Giving Deployment Guide

## Overview

Shift Giving is deployed to AWS using:
- **AWS App Runner** - Container-based deployment for the .NET API
- **AWS ECR** - Docker container registry
- **AWS RDS** - Shared PostgreSQL database (in private VPC)
- **AWS S3 + CloudFront** - Static web app hosting with CDN
- **AWS ACM** - SSL certificates
- **Vercel DNS** - Domain management

## Infrastructure Details

### API (App Runner)

| Resource | Value |
|----------|-------|
| AWS Account | 338977415134 |
| AWS Region | us-east-1 |
| ECR Repository | 338977415134.dkr.ecr.us-east-1.amazonaws.com/giving-app |
| App Runner Service ARN | arn:aws:apprunner:us-east-1:338977415134:service/Giving/bb7051ff9d9a429a9d0f888df81b99fd |
| App Runner URL | https://6egddr9uvm.us-east-1.awsapprunner.com |
| VPC Connector ARN | arn:aws:apprunner:us-east-1:338977415134:vpcconnector/giving-app-vpc-connector/1/620374372f95459b90bdbdb68c341378 |
| API Port | 8080 |

### Web App (S3 + CloudFront)

| Resource | Value |
|----------|-------|
| S3 Bucket | shift-giving-web-app-bucket |
| CloudFront Distribution ID | E1SM7K53IIX4YZ |
| CloudFront Domain | d1a1mau07wmfww.cloudfront.net |
| ACM Certificate ARN | arn:aws:acm:us-east-1:338977415134:certificate/9a642f3c-1a3a-45ea-88a5-d547b8b64b89 |
| Custom Domain | giving.justyn.app |

### Database (RDS)

| Resource | Value |
|----------|-------|
| RDS Instance | shared-postgres.cup8wgoeu6zy.us-east-1.rds.amazonaws.com |
| RDS Port | 5432 |
| RDS Username | postgres |
| RDS Engine | PostgreSQL 15.14 |
| Database Name | giving_db |
| RDS VPC | vpc-01c5b3ce6b3d0fc47 |
| RDS Security Group | sg-071a51bb6325c7796 |
| Public Subnet (for bastion) | subnet-0534eae98dc25f104 |

### DNS Configuration (Vercel)

| Record | Type | Value |
|--------|------|-------|
| `giving` | CNAME | `d1a1mau07wmfww.cloudfront.net` |
| `_8e468bd766b1fa0bcd105635cd9e586e.giving` | CNAME | `_11d2f4c395ca579ebf5505a997cfba6c.jkddzztszm.acm-validations.aws.` |

## Prerequisites

1. **AWS CLI** configured with `amplify-admin` credentials
2. **Docker** running (Colima or Docker Desktop)
3. **.NET 10 SDK** installed (for local development)

### Starting Docker with Colima

```bash
# Install Colima (if not installed)
brew install colima

# Start Colima
colima start

# Verify Docker is working
docker info
```

## Deployment Steps

### 1. Login to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 338977415134.dkr.ecr.us-east-1.amazonaws.com
```

### 2. Build Docker Image

```bash
cd api/ShiftGiving
docker build --platform linux/amd64 -t giving-app:latest .
```

### 3. Tag and Push to ECR

```bash
docker tag giving-app:latest 338977415134.dkr.ecr.us-east-1.amazonaws.com/giving-app:latest
docker push 338977415134.dkr.ecr.us-east-1.amazonaws.com/giving-app:latest
```

### 4. Trigger App Runner Deployment

```bash
aws apprunner start-deployment \
  --service-arn arn:aws:apprunner:us-east-1:338977415134:service/Giving/bb7051ff9d9a429a9d0f888df81b99fd \
  --region us-east-1
```

### 5. Verify Deployment

```bash
# Check health endpoint (App Runner URL)
curl https://6egddr9uvm.us-east-1.awsapprunner.com/health

# Check health endpoint (Custom Domain - after DNS is configured)
curl https://giving.justyn.app/health

# Expected response:
# {"status":"healthy","timestamp":"...","database":"connected"}
```

## One-Time Setup (Already Completed)

### Create ECR Repository

```bash
aws ecr create-repository --repository-name giving-app --region us-east-1
```

### Create Database via Bastion

Since RDS is in a private VPC, use a temporary bastion host:

```bash
# 1. Create temporary security group for bastion
BASTION_SG=$(aws ec2 create-security-group \
  --group-name bastion-temp-sg \
  --description "Temporary bastion security group" \
  --vpc-id vpc-01c5b3ce6b3d0fc47 \
  --region us-east-1 \
  --query 'GroupId' --output text)

# 2. Allow SSH to bastion
aws ec2 authorize-security-group-ingress \
  --group-id $BASTION_SG \
  --protocol tcp --port 22 --cidr 0.0.0.0/0 \
  --region us-east-1

# 3. Allow bastion to connect to RDS
aws ec2 authorize-security-group-ingress \
  --group-id sg-071a51bb6325c7796 \
  --protocol tcp --port 5432 \
  --source-group $BASTION_SG \
  --region us-east-1

# 4. Create user-data script
cat << 'USERDATA' > /tmp/bastion-userdata.sh
#!/bin/bash
dnf install -y postgresql15
PGPASSWORD='<RDS_PASSWORD>' psql -h shared-postgres.cup8wgoeu6zy.us-east-1.rds.amazonaws.com -U postgres -c "CREATE DATABASE giving_db;"
USERDATA

# 5. Launch bastion
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-07ff62358b87c7116 \
  --instance-type t3.micro \
  --subnet-id subnet-0534eae98dc25f104 \
  --security-group-ids $BASTION_SG \
  --associate-public-ip-address \
  --user-data file:///tmp/bastion-userdata.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=temp-bastion-giving-db}]' \
  --region us-east-1 \
  --query 'Instances[0].InstanceId' --output text)

# 6. Wait for database creation (about 60 seconds)
sleep 60

# 7. Terminate bastion
aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region us-east-1

# 8. Clean up security group (after instance is terminated)
aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID --region us-east-1
aws ec2 revoke-security-group-ingress \
  --group-id sg-071a51bb6325c7796 \
  --protocol tcp --port 5432 \
  --source-group $BASTION_SG \
  --region us-east-1
aws ec2 delete-security-group --group-id $BASTION_SG --region us-east-1
```

### Create VPC Connector for App Runner

App Runner needs a VPC connector to access RDS in the private VPC:

```bash
aws apprunner create-vpc-connector \
  --vpc-connector-name giving-app-vpc-connector \
  --subnets subnet-0534eae98dc25f104 subnet-0f71a190df51e21bf \
  --security-groups sg-071a51bb6325c7796 \
  --region us-east-1
```

### Create App Runner Service

```bash
aws apprunner create-service \
  --service-name Giving \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "338977415134.dkr.ecr.us-east-1.amazonaws.com/giving-app:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "8080",
        "RuntimeEnvironmentVariables": {
          "ASPNETCORE_ENVIRONMENT": "Production",
          "ConnectionStrings__DefaultConnection": "Host=shared-postgres.cup8wgoeu6zy.us-east-1.rds.amazonaws.com;Database=giving_db;Username=postgres;Password=<RDS_PASSWORD>",
          "JWT_SECRET": "<GENERATE_128_CHAR_SECRET>",
          "Jwt__Issuer": "GivingApp",
          "Jwt__Audience": "GivingApp"
        }
      }
    },
    "AutoDeploymentsEnabled": false,
    "AuthenticationConfiguration": {
      "AccessRoleArn": "arn:aws:iam::338977415134:role/AppRunnerECRAccessRole"
    }
  }' \
  --instance-configuration '{
    "Cpu": "1024",
    "Memory": "2048"
  }' \
  --health-check-configuration '{
    "Protocol": "HTTP",
    "Path": "/health",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 1,
    "UnhealthyThreshold": 5
  }' \
  --network-configuration '{
    "EgressConfiguration": {
      "EgressType": "VPC",
      "VpcConnectorArn": "arn:aws:apprunner:us-east-1:338977415134:vpcconnector/giving-app-vpc-connector/1/620374372f95459b90bdbdb68c341378"
    }
  }' \
  --region us-east-1

# Generate JWT secret with:
openssl rand -hex 64
```

### Configure Custom Domain

1. Associate domain with App Runner:
```bash
aws apprunner associate-custom-domain \
  --service-arn arn:aws:apprunner:us-east-1:338977415134:service/Giving/bb7051ff9d9a429a9d0f888df81b99fd \
  --domain-name giving.justyn.app \
  --region us-east-1
```

2. Get DNS validation records:
```bash
aws apprunner describe-custom-domains \
  --service-arn arn:aws:apprunner:us-east-1:338977415134:service/Giving/bb7051ff9d9a429a9d0f888df81b99fd \
  --region us-east-1
```

3. Add records in Vercel Dashboard → Domains → justyn.app:
   - **Certificate validation CNAME** (from output above)
   - **Main CNAME**: `giving` → `6egddr9uvm.us-east-1.awsapprunner.com`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ASPNETCORE_ENVIRONMENT` | Set to `Production` | Yes |
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | 128-character secret for JWT signing | Yes |
| `Jwt__Issuer` | JWT issuer (default: GivingApp) | No |
| `Jwt__Audience` | JWT audience (default: GivingApp) | No |

## Viewing Logs

```bash
# List log groups
aws logs describe-log-groups --log-group-name-prefix "/aws/apprunner/Giving" --region us-east-1

# Tail logs
aws logs tail "/aws/apprunner/Giving/bb7051ff9d9a429a9d0f888df81b99fd/application" --follow --region us-east-1
```

## Database Migrations

Run migrations via bastion (see "Create Database via Bastion" section above):

```bash
# In the bastion user-data, add migration commands:
PGPASSWORD='<RDS_PASSWORD>' psql \
  -h shared-postgres.cup8wgoeu6zy.us-east-1.rds.amazonaws.com \
  -U postgres -d giving_db \
  -f /path/to/migration.sql
```

Or use EF Core migrations locally if you have VPN access:
```bash
cd api/ShiftGiving
dotnet ef database update
```

## Troubleshooting

### App Runner service won't start
1. Check ECR image exists: `aws ecr describe-images --repository-name giving-app --region us-east-1`
2. Check App Runner logs in CloudWatch
3. Verify environment variables are set correctly
4. Ensure VPC connector is properly configured

### Database connection issues
1. Verify VPC connector is attached to App Runner service
2. Check RDS security group allows App Runner VPC connector
3. Verify connection string format
4. Test connection via bastion if needed

### Health check failures
1. Ensure `/health` endpoint returns 200 OK
2. Check application logs for startup errors
3. Verify port 8080 is exposed in Dockerfile

### DNS/Certificate issues
1. Verify CNAME records are correctly configured in Vercel
2. Check certificate validation status: `aws apprunner describe-custom-domains --service-arn <ARN>`
3. DNS propagation can take up to 48 hours

## Web App Deployment

### Build and Deploy to S3

```bash
# Build the web app
cd web
npm run build

# Deploy to S3
aws s3 sync dist s3://shift-giving-web-app-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E1SM7K53IIX4YZ --paths "/*"
```

### Environment Configuration

The web app uses environment variables at build time:

| File | Purpose |
|------|---------|
| `.env` | Local development |
| `.env.production` | Production build |

Production environment variables:
```
VITE_API_URL=https://6egddr9uvm.us-east-1.awsapprunner.com
VITE_GOOGLE_MAPS_API_KEY=<your-key>
```

### CloudFront Custom Domain Setup

1. Request ACM certificate:
```bash
aws acm request-certificate \
  --domain-name "giving.justyn.app" \
  --validation-method DNS \
  --region us-east-1
```

2. Add DNS validation CNAME to Vercel

3. Update CloudFront with certificate and alias:
```bash
# Get current config
aws cloudfront get-distribution-config --id E1SM7K53IIX4YZ > /tmp/cf-config.json

# Update Aliases and ViewerCertificate, then:
aws cloudfront update-distribution --id E1SM7K53IIX4YZ --if-match <ETAG> --distribution-config file:///tmp/cf-config-updated.json
```

## Database Seed Data

Seed data is located at `api/ShiftGiving/Data/seed_data.sql`. To run migrations:

### Via Bastion Host

```bash
# 1. Create temporary security group
BASTION_SG=$(aws ec2 create-security-group \
  --group-name bastion-temp-sg-$(date +%s) \
  --description "Temporary bastion for DB migration" \
  --vpc-id vpc-01c5b3ce6b3d0fc47 \
  --region us-east-1 \
  --query 'GroupId' --output text)

# 2. Allow bastion to connect to RDS
aws ec2 authorize-security-group-ingress \
  --group-id sg-071a51bb6325c7796 \
  --protocol tcp --port 5432 \
  --source-group $BASTION_SG \
  --region us-east-1

# 3. Upload seed script to S3
aws s3 cp api/ShiftGiving/Data/seed_data.sql s3://shift-giving-web-app-bucket/migrations/seed_data.sql

# 4. Launch bastion with user-data script
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0724302e25d16f8f2 \
  --instance-type t3.micro \
  --subnet-id subnet-0534eae98dc25f104 \
  --security-group-ids $BASTION_SG \
  --associate-public-ip-address \
  --iam-instance-profile Name=BastionS3AccessProfile \
  --user-data '#!/bin/bash
dnf install -y postgresql15 awscli
aws s3 cp s3://shift-giving-web-app-bucket/migrations/seed_data.sql /tmp/seed_data.sql
PGPASSWORD="<RDS_PASSWORD>" psql -h shared-postgres.cup8wgoeu6zy.us-east-1.rds.amazonaws.com -U postgres -d giving_db -f /tmp/seed_data.sql' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=temp-bastion-db-migration}]' \
  --region us-east-1 \
  --query 'Instances[0].InstanceId' --output text)

# 5. Wait for migration (90 seconds)
sleep 90

# 6. Terminate bastion and cleanup
aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region us-east-1
aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID --region us-east-1
aws ec2 revoke-security-group-ingress \
  --group-id sg-071a51bb6325c7796 \
  --protocol tcp --port 5432 \
  --source-group $BASTION_SG \
  --region us-east-1
aws ec2 delete-security-group --group-id $BASTION_SG --region us-east-1
```

### Test Users (Password: Password123!)

| Email | Role |
|-------|------|
| justyn@justyn.com | Site Admin |
| donor@example.com | Donor |
| orgadmin@example.com | Organization Admin |
| siteadmin@example.com | Site Admin |

## Cost Estimate

| Resource | Estimated Cost |
|----------|---------------|
| App Runner (1 vCPU, 2GB) | ~$46/month |
| RDS (shared) | ~$5/month (split) |
| ECR storage | ~$1/month |
| S3 (web app) | ~$1/month |
| CloudFront | ~$1/month |
| Data transfer | Varies |

## Related Files

- `api/ShiftGiving/Dockerfile` - Container build configuration
- `api/ShiftGiving/appsettings.json` - Application configuration
- `api/ShiftGiving/Data/seed_data.sql` - Database seed data
- `web/.env.production` - Web app production environment
- `.github/workflows/build_test_deploy.yml` - CI/CD pipeline

## Quick Reference Commands

```bash
# === API Deployment ===

# Start Docker (Colima)
colima start

# ECR Login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 338977415134.dkr.ecr.us-east-1.amazonaws.com

# Build & Push API
cd api/ShiftGiving
docker build --platform linux/amd64 -t giving-app:latest . && \
docker tag giving-app:latest 338977415134.dkr.ecr.us-east-1.amazonaws.com/giving-app:latest && \
docker push 338977415134.dkr.ecr.us-east-1.amazonaws.com/giving-app:latest

# Deploy API
aws apprunner start-deployment \
  --service-arn arn:aws:apprunner:us-east-1:338977415134:service/Giving/bb7051ff9d9a429a9d0f888df81b99fd \
  --region us-east-1

# === Web App Deployment ===

# Build & Deploy Web
cd web
npm run build
aws s3 sync dist s3://shift-giving-web-app-bucket --delete
aws cloudfront create-invalidation --distribution-id E1SM7K53IIX4YZ --paths "/*"

# === Health Checks ===

# API Health
curl https://6egddr9uvm.us-east-1.awsapprunner.com/health

# Web App
curl https://giving.justyn.app
```

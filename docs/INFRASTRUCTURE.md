# Flight Search App Infrastructure

This document describes the infrastructure configuration for deploying the Flight Search App using OpenTofu (previously Terraform).

## Prerequisites

- OpenTofu v1.9.0 or later (installed via ASDF)
- AWS CLI configured with appropriate credentials
- AWS Account with necessary permissions

## Directory Structure

```
terraform/
├── environments/       # Environment-specific configurations
│   ├── dev/           # Development environment
│   │   ├── main.tf    # Main configuration file
│   │   ├── variables.tf # Environment variables
│   │   └── outputs.tf # Output definitions
│   └── prod/          # Production environment
│       ├── main.tf    # Main configuration file
│       ├── variables.tf # Environment variables
│       └── outputs.tf # Output definitions
├── modules/           # Reusable infrastructure modules
│   ├── s3_hosting/    # S3 static website hosting module
│   │   ├── main.tf    # S3 bucket configuration
│   │   ├── variables.tf # Module variables
│   │   └── outputs.tf # Module outputs
│   └── cloudfront/    # CloudFront CDN module
│       ├── main.tf    # CloudFront distribution configuration
│       ├── variables.tf # Module variables
│       └── outputs.tf # Module outputs
├── provider.tf        # AWS provider configuration
└── README.md          # Infrastructure documentation
```

## Usage

### Development Environment

```bash
# Navigate to the development environment directory
cd terraform/environments/dev

# Initialize OpenTofu
asdf exec tofu init

# Plan the infrastructure changes
asdf exec tofu plan -out=plan.out

# Apply the infrastructure changes
asdf exec tofu apply plan.out
```

### Production Environment

```bash
# Navigate to the production environment directory
cd terraform/environments/prod

# Initialize OpenTofu
asdf exec tofu init

# Plan the infrastructure changes
asdf exec tofu plan -out=plan.out

# Apply the infrastructure changes
asdf exec tofu apply plan.out
```

## Modules

### S3 Hosting Module

Creates an S3 bucket configured for static website hosting with proper access control and encryption.

#### Features
- Static website hosting configuration
- HTTPS enforcement
- Object lifecycle policies
- Server-side encryption
- Public access blocking

### CloudFront Module

Creates a CloudFront distribution for serving the website with CDN capabilities.

#### Features
- HTTPS enforcement with custom SSL certificate
- Edge locations optimization
- Cache control policies
- Origin access identity for S3 security
- Custom error responses

## Cleanup

To destroy the infrastructure when it's no longer needed:

```bash
# Development environment
cd terraform/environments/dev
asdf exec tofu destroy

# Production environment
cd terraform/environments/prod
asdf exec tofu destroy
```

## CI/CD Integration

The infrastructure can be deployed automatically through CI/CD pipelines:

1. CI/CD workflow triggers on main branch changes
2. OpenTofu plan runs automatically
3. Manual approval for production deployments
4. Automatic application of changes after approval

## Troubleshooting

Common issues and solutions:

- **State file lock issues**: Use `asdf exec tofu force-unlock [LOCK_ID]`
- **S3 access denied**: Check IAM permissions for the user
- **CloudFront distribution errors**: Verify certificate setup and origin paths 
# Flight Search App Infrastructure

This directory contains the OpenTofu (previously Terraform) configuration for deploying the Flight Search App infrastructure.

## Prerequisites

- OpenTofu v1.9.0 or later (installed via ASDF)
- AWS CLI configured with appropriate credentials

## Directory Structure

```
terraform/
├── environments/       # Environment-specific configurations
│   ├── dev/           # Development environment
│   └── prod/          # Production environment
├── modules/           # Reusable infrastructure modules
│   ├── s3_hosting/    # S3 static website hosting module
│   └── cloudfront/    # CloudFront CDN module
├── provider.tf        # AWS provider configuration
└── README.md          # This file
```

## Usage

### Development Environment

```bash
cd terraform/environments/dev
asdf exec tofu init
asdf exec tofu plan
asdf exec tofu apply
```

### Production Environment

```bash
cd terraform/environments/prod
asdf exec tofu init
asdf exec tofu plan
asdf exec tofu apply
```

## Modules

### S3 Hosting

Creates an S3 bucket configured for static website hosting.

### CloudFront

Creates a CloudFront distribution for serving the website with CDN capabilities. 
# CI/CD Pipeline for Flight Search App

This document explains the CI/CD pipeline setup for the Flight Search App using GitHub Actions and how to configure it properly.

## Overview

The CI/CD pipeline consists of two main jobs:

1. **Terraform**: Manages the infrastructure deployment
   - Runs terraform fmt, validate, plan, and apply
   - Outputs infrastructure details for the deployment job
   - Posts plan results to PR comments when applicable

2. **Build and Deploy**: Builds and deploys the application
   - Builds the Next.js application
   - Deploys to S3
   - Invalidates CloudFront cache
   - Posts deployment status as a commit comment

## Workflow Triggers

The pipeline is triggered on:
- Push to the `main` branch (full deployment)
- Pull Requests to the `main` branch (infrastructure plan only)
- Manual trigger via GitHub Actions UI

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key with permissions to deploy the infrastructure |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key paired with the access key ID |
| `NOTIFICATION_EMAIL` | Email address to receive AWS budget alerts |
| `TF_API_TOKEN` | (Optional) Terraform Cloud API token if using Terraform Cloud |

## AWS IAM Policy

The AWS access key used should have an IAM policy attached that allows it to:
- Create and manage S3 buckets
- Create and manage CloudFront distributions
- Create and manage Lambda functions
- Create and manage CloudWatch resources
- Create and manage Route53 records (if using custom domain)
- Create and manage AWS Budgets

See the [IAM_POLICY_INSTRUCTIONS.md](../terraform/IAM_POLICY_INSTRUCTIONS.md) file for more details.

## Environment Variables

The workflow uses the following environment variables:
- `AWS_REGION`: The AWS region to deploy to (default: us-east-1)
- `ENVIRONMENT`: Determined based on the branch (main = 'prod', others = 'dev')
- `TF_WORKING_DIR`: Directory containing Terraform configuration (default: terraform)

## Outputs

After a successful deployment, the workflow:
1. Posts the deployment status as a commit comment
2. Includes a link to the deployed website

## Local Testing

To test the infrastructure changes locally before committing:

```bash
cd terraform
terraform init
terraform validate
terraform plan
```

## Troubleshooting

If the CI/CD pipeline fails, check:
1. GitHub Actions logs for detailed error messages
2. AWS IAM permissions for the service account
3. Required GitHub secrets are properly configured
4. Terraform configuration is valid 
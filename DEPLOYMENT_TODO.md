# Deployment TODO List: Next.js App to AWS S3 with CloudFront

This document outlines the steps needed to deploy our Next.js application to AWS S3 with CloudFront distribution using Terraform for infrastructure as code.

## Prerequisites

- [x] Install AWS CLI and configure with appropriate credentials
- [ ] Install Terraform CLI (version 1.0+)
- [ ] Ensure you have a domain name registered (optional, but recommended for production)
- [ ] Create an AWS account with appropriate permissions

## Next.js Build Configuration

- [x] Update Next.js configuration for static export
  - [x] Modify `next.config.js` to add `output: 'export'`
  - [x] Ensure all API routes are properly handled (static export doesn't support API routes)
  - [x] Test the static export locally with `npm run build && npm run start`
- [x] Create a build script in package.json for deployment

## Terraform Infrastructure Setup

- [x] Create a `terraform` directory in the project root
- [x] Create the following Terraform files:
  - [x] `main.tf` - Main configuration file
  - [x] `variables.tf` - Variable definitions
  - [x] `outputs.tf` - Output values
  - [x] `providers.tf` - Provider configuration
  - [x] `s3.tf` - S3 bucket configuration
  - [x] `cloudfront.tf` - CloudFront distribution
  - [x] `route53.tf` - DNS configuration (if using a custom domain)
  - [x] `terraform.tfvars` - Variable values (add to .gitignore)

## S3 Configuration

- [x] Configure S3 bucket for static website hosting
- [x] Set up appropriate bucket policies
- [x] Configure CORS if necessary
- [x] Set up bucket versioning for rollbacks

## CloudFront Configuration

- [x] Create CloudFront distribution pointing to S3 bucket
- [x] Configure cache behaviors
- [x] Set up SSL certificate (using ACM)
- [x] Configure custom error responses for SPA routing
- [x] Set up proper cache invalidation

## CI/CD Pipeline

- [x] Create GitHub Actions workflow (or other CI/CD tool)
  - [x] Set up build step
  - [x] Configure Terraform apply step
  - [x] Set up S3 sync for deployment
  - [x] Configure CloudFront cache invalidation
- [x] Create local deployment script for manual deployments

## Environment Variables

- [x] Set up environment variables for different environments
  - [x] Development
  - [ ] Staging
  - [ ] Production
- [x] Configure secrets management in AWS (using .env.local file)

## Monitoring and Logging

- [x] Set up CloudWatch alarms
- [x] Configure S3 and CloudFront logging
- [x] Set up error tracking

## Security

- [x] Configure appropriate IAM roles and policies
- [x] Set up WAF rules (optional)
- [x] Implement security headers in CloudFront

## Testing

- [x] Test the deployment process end-to-end
- [ ] Verify all application functionality works in the deployed environment
- [ ] Test rollback procedures

## Documentation

- [x] Document the deployment process
- [ ] Create runbooks for common operations
- [ ] Document troubleshooting steps

## Cost Optimization

- [x] Review and optimize CloudFront distribution settings
- [x] Set up cost alarms
- [x] Configure lifecycle policies for S3

## Post-Deployment

- [x] Set up monitoring for the production environment
- [ ] Create a maintenance plan
- [ ] Document the deployed architecture 
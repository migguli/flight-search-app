# Deployment TODO List: Next.js App to AWS S3 with CloudFront

This document outlines the steps needed to deploy our Next.js application to AWS S3 with CloudFront distribution using Terraform for infrastructure as code.

## Prerequisites

- [ ] Install AWS CLI and configure with appropriate credentials
- [ ] Install Terraform CLI (version 1.0+)
- [ ] Ensure you have a domain name registered (optional, but recommended for production)
- [ ] Create an AWS account with appropriate permissions

## Next.js Build Configuration

- [ ] Update Next.js configuration for static export
  - [ ] Modify `next.config.js` to add `output: 'export'`
  - [ ] Ensure all API routes are properly handled (static export doesn't support API routes)
  - [ ] Test the static export locally with `npm run build && npm run start`
- [ ] Create a build script in package.json for deployment

## Terraform Infrastructure Setup

- [ ] Create a `terraform` directory in the project root
- [ ] Create the following Terraform files:
  - [ ] `main.tf` - Main configuration file
  - [ ] `variables.tf` - Variable definitions
  - [ ] `outputs.tf` - Output values
  - [ ] `providers.tf` - Provider configuration
  - [ ] `s3.tf` - S3 bucket configuration
  - [ ] `cloudfront.tf` - CloudFront distribution
  - [ ] `route53.tf` - DNS configuration (if using a custom domain)
  - [ ] `terraform.tfvars` - Variable values (add to .gitignore)

## S3 Configuration

- [ ] Configure S3 bucket for static website hosting
- [ ] Set up appropriate bucket policies
- [ ] Configure CORS if necessary
- [ ] Set up bucket versioning for rollbacks

## CloudFront Configuration

- [ ] Create CloudFront distribution pointing to S3 bucket
- [ ] Configure cache behaviors
- [ ] Set up SSL certificate (using ACM)
- [ ] Configure custom error responses for SPA routing
- [ ] Set up proper cache invalidation

## CI/CD Pipeline

- [ ] Create GitHub Actions workflow (or other CI/CD tool)
  - [ ] Set up build step
  - [ ] Configure Terraform apply step
  - [ ] Set up S3 sync for deployment
  - [ ] Configure CloudFront cache invalidation

## Environment Variables

- [ ] Set up environment variables for different environments
  - [ ] Development
  - [ ] Staging
  - [ ] Production
- [ ] Configure secrets management in AWS (SSM Parameter Store or Secrets Manager)

## Monitoring and Logging

- [ ] Set up CloudWatch alarms
- [ ] Configure S3 and CloudFront logging
- [ ] Set up error tracking

## Security

- [ ] Configure appropriate IAM roles and policies
- [ ] Set up WAF rules (optional)
- [ ] Implement security headers in CloudFront

## Testing

- [ ] Test the deployment process end-to-end
- [ ] Verify all application functionality works in the deployed environment
- [ ] Test rollback procedures

## Documentation

- [ ] Document the deployment process
- [ ] Create runbooks for common operations
- [ ] Document troubleshooting steps

## Cost Optimization

- [ ] Review and optimize CloudFront distribution settings
- [ ] Set up cost alarms
- [ ] Configure lifecycle policies for S3

## Post-Deployment

- [ ] Set up monitoring for the production environment
- [ ] Create a maintenance plan
- [ ] Document the deployed architecture 
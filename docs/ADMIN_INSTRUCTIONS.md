# Flight Search App - AWS Administrator Instructions

This document provides step-by-step instructions for AWS administrators to set up the necessary permissions and resources for the Flight Search App's infrastructure deployment.

## Prerequisites

- Administrator access to AWS Management Console
- AWS CLI installed and configured
- Basic understanding of AWS IAM policies, S3, and DynamoDB

## Setup Steps

### 1. IAM User Configuration

The IAM user `hackaton_flightplanner` needs specific permissions to manage the app infrastructure. Follow these steps to create a comprehensive policy:

#### 1.1 Create and Apply IAM Policy

```bash
# Create policy (if it doesn't exist)
aws iam create-policy \
    --policy-name FlightSearchAppPolicy \
    --policy-document file://combined-policy.json

# Attach policy to user
aws iam attach-user-policy \
    --user-name hackaton_flightplanner \
    --policy-arn arn:aws:iam::646678986868:policy/FlightSearchAppPolicy
```

#### 1.2 Verify Policy Attachment

```bash
# Verify the policy is attached
aws iam list-attached-user-policies \
    --user-name hackaton_flightplanner
```

### 2. Terraform State Management Resources

#### 2.1 Create the Terraform State Bucket

```bash
# Create bucket
aws s3api create-bucket \
    --bucket flight-search-app-tfstate \
    --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket flight-search-app-tfstate \
    --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
    --bucket flight-search-app-tfstate \
    --server-side-encryption-configuration '{
      "Rules": [
        {
          "ApplyServerSideEncryptionByDefault": {
            "SSEAlgorithm": "AES256"
          }
        }
      ]
    }'

# Add bucket policy to restrict access
aws s3api put-bucket-policy \
    --bucket flight-search-app-tfstate \
    --policy '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::646678986868:user/hackaton_flightplanner"
          },
          "Action": "s3:*",
          "Resource": [
            "arn:aws:s3:::flight-search-app-tfstate",
            "arn:aws:s3:::flight-search-app-tfstate/*"
          ]
        }
      ]
    }'
```

#### 2.2 Create DynamoDB Table for State Locking

```bash
# Create DynamoDB table for state locking
aws dynamodb create-table \
    --table-name terraform-state-lock \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 3. Terraform Backend Configuration

After creating the state bucket and DynamoDB table, ensure the backend configuration in `provider.tf` is updated:

```hcl
terraform {
  backend "s3" {
    bucket         = "flight-search-app-tfstate"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

Then initialize Terraform with the new backend:

```bash
tofu init -reconfigure
```

## Security Best Practices

1. **Least Privilege**: The policy gives only the minimum required permissions
2. **Encryption**: All S3 buckets are encrypted by default
3. **Access Logging**: Enable S3 access logging for audit purposes
4. **Resource Tagging**: Tag all resources for billing and management

## Troubleshooting

### Common Issues

1. **Access Denied Errors**:
   - Verify IAM policy is correctly attached
   - Check if bucket policy is properly configured
   - Ensure region settings are consistent

2. **Locking Issues**:
   - Check DynamoDB capacity and throughput
   - Manually release lock if needed:
     ```bash
     aws dynamodb delete-item \
         --table-name terraform-state-lock \
         --key '{"LockID": {"S": "flight-search-app-tfstate/terraform.tfstate-md5"}}'
     ```

3. **Terraform/OpenTofu Initialization Problems**:
   - Verify AWS credentials are properly configured
   - Check network connectivity to AWS services
   - Ensure S3 bucket exists and is accessible

## Resource Cleanup

If the infrastructure is no longer needed:

```bash
# Delete state bucket (after removing versioned objects)
aws s3 rm s3://flight-search-app-tfstate --recursive
aws s3api delete-bucket --bucket flight-search-app-tfstate

# Delete DynamoDB table
aws dynamodb delete-table --table-name terraform-state-lock

# Detach and delete IAM policy
aws iam detach-user-policy \
    --user-name hackaton_flightplanner \
    --policy-arn arn:aws:iam::646678986868:policy/FlightSearchAppPolicy
aws iam delete-policy --policy-arn arn:aws:iam::646678986868:policy/FlightSearchAppPolicy
```

## Contact Information

For assistance with AWS administration, contact the infrastructure team at:
- Email: infra-team@flightsearch.example.com
- Slack: #flight-search-infra 
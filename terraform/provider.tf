/*
  Required AWS Permissions for Terraform Remote State:
  
  The IAM user or role running Terraform needs the following permissions:
  - S3 bucket access for state storage
  - DynamoDB table access for state locking (if enabled)
  
  A sample policy is provided in the combined-policy.json file.
  
  We've successfully created a dedicated bucket (flight-search-app-tfstate) for Terraform state
  with versioning and encryption enabled.
*/

terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "opentofu/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "flight-search-app-tfstate"
    key    = "terraform.tfstate"
    region = "us-east-1"
    # Uncomment if you're using DynamoDB for state locking
    # dynamodb_table = "terraform-state-lock"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
  
  # AWS credentials are typically provided via environment variables:
  # AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
  # Or you can specify them here (not recommended for security reasons)
  # access_key = "your-access-key"
  # secret_key = "your-secret-key"
  
  default_tags {
    tags = {
      Project     = "FlightSearchApp"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
} 
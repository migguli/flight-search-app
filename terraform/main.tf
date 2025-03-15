# Main Terraform configuration file
# This file serves as the main entry point for the Terraform configuration
# Most resources are defined in their respective files (s3.tf, cloudfront.tf, etc.)

# Define local variables
locals {
  # Updated to use dedicated state bucket (flight-search-app-tfstate)
  bucket_suffix = var.environment
  website_bucket_name = "flight-search-app-${local.bucket_suffix}"
  logs_bucket_name    = "${local.website_bucket_name}-logs"
  environment_name = var.environment
  app_full_name    = "${var.app_name}-${local.environment_name}"
  common_tags = {
    Project     = var.app_name
    Environment = local.environment_name
    ManagedBy   = "Terraform"
  }
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {} 
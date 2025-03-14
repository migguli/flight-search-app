# Main Terraform configuration file
# This file serves as the main entry point for the Terraform configuration
# Most resources are defined in their respective files (s3.tf, cloudfront.tf, etc.)

# Define local variables
locals {
  environment_name = var.environment
  app_full_name    = "${var.app_name}-${local.environment_name}"
  common_tags = {
    Project     = var.app_name
    Environment = local.environment_name
    ManagedBy   = "Terraform"
  }
} 
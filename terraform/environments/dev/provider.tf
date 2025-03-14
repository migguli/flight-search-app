terraform {
  required_providers {
    aws = {
      source  = "opentofu/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
} 
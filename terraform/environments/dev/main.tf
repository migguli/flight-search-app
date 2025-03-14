terraform {
  backend "local" {
    path = "terraform.dev.tfstate"
  }
}

# Use data source to reference existing S3 bucket
data "aws_s3_bucket" "website_bucket" {
  bucket = "flight-search-app-dev"
}

# Create website configuration for the existing bucket
resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = data.aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

# Create CloudFront distribution for the existing bucket
module "cloudfront" {
  source = "../../modules/cloudfront"

  bucket_regional_domain_name = data.aws_s3_bucket.website_bucket.bucket_regional_domain_name
  environment                 = "dev"
} 
variable "bucket_regional_domain_name" {
  description = "S3 bucket regional domain name"
  type        = string
}

variable "origin_id" {
  description = "Origin ID for CloudFront"
  type        = string
  default     = "S3Origin"
}

variable "environment" {
  description = "Environment (dev, prod, etc)"
  type        = string
} 
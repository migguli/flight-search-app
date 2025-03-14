variable "bucket_name" {
  description = "Name of the S3 bucket for hosting"
  type        = string
}

variable "environment" {
  description = "Environment (dev, prod, etc)"
  type        = string
} 
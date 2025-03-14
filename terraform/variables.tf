variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "flight-search-app"
}

variable "domain_name" {
  description = "Domain name for the website (optional)"
  type        = string
  default     = ""
}

variable "create_dns_record" {
  description = "Whether to create DNS records in Route 53"
  type        = bool
  default     = false
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID (required if create_dns_record is true)"
  type        = string
  default     = ""
}

variable "notification_email" {
  description = "Email address for notifications and alerts"
  type        = string
  default     = "your-email@example.com"
} 
# S3 Access Logging Bucket
resource "aws_s3_bucket" "logs" {
  bucket = "${var.app_name}-${var.environment}-logs"
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "logs" {
  depends_on = [aws_s3_bucket_ownership_controls.logs]
  bucket     = aws_s3_bucket.logs.id
  acl        = "private"
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    id     = "log-expiration"
    status = "Enabled"

    expiration {
      days = 90 # Delete logs after 90 days
    }
  }
}

# Enable S3 bucket logging for the website bucket
resource "aws_s3_bucket_logging" "website" {
  bucket        = aws_s3_bucket.website.id
  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "s3-access-logs/"
}

# CloudWatch Alarms for the S3 bucket
resource "aws_cloudwatch_metric_alarm" "s3_4xx_errors" {
  alarm_name          = "${var.app_name}-${var.environment}-s3-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/S3"
  period              = "300" # 5 minutes
  statistic           = "Average"
  threshold           = "5"
  alarm_description   = "This alarm monitors S3 4xx errors"
  alarm_actions       = []
  treat_missing_data  = "notBreaching"

  dimensions = {
    BucketName = aws_s3_bucket.website.bucket
  }
}

# CloudWatch Alarm for CloudFront errors
resource "aws_cloudwatch_metric_alarm" "cloudfront_5xx_errors" {
  alarm_name          = "${var.app_name}-${var.environment}-cloudfront-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300" # 5 minutes
  statistic           = "Average"
  threshold           = "5"
  alarm_description   = "This alarm monitors CloudFront 5xx errors"
  alarm_actions       = []
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.website.id
    Region         = "Global"
  }
}

# CloudWatch Dashboard for monitoring the application
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.app_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "Requests", "Region", "Global", "DistributionId", aws_cloudfront_distribution.website.id]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "CloudFront Requests"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "4xxErrorRate", "Region", "Global", "DistributionId", aws_cloudfront_distribution.website.id],
            ["AWS/CloudFront", "5xxErrorRate", "Region", "Global", "DistributionId", aws_cloudfront_distribution.website.id]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "CloudFront Error Rates"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/S3", "AllRequests", "BucketName", aws_s3_bucket.website.bucket],
            ["AWS/S3", "GetRequests", "BucketName", aws_s3_bucket.website.bucket]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "S3 Requests"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/S3", "4xxErrors", "BucketName", aws_s3_bucket.website.bucket],
            ["AWS/S3", "5xxErrors", "BucketName", aws_s3_bucket.website.bucket]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "S3 Errors"
        }
      }
    ]
  })
} 
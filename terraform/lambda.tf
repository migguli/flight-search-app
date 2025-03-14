data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    
    principals {
      type        = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "lambda_edge_role" {
  name               = "${var.app_name}-${var.environment}-lambda-edge-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_edge_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "security_headers" {
  provider         = aws.us-east-1 # Lambda@Edge must be in us-east-1
  function_name    = "${var.app_name}-${var.environment}-security-headers"
  filename         = "${path.module}/lambda/security-headers.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/security-headers.zip")
  role             = aws_iam_role.lambda_edge_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  publish          = true
  
  lifecycle {
    ignore_changes = [
      # Ignore changes to source_code_hash as Lambda@Edge deployments can be tricky to update
      source_code_hash
    ]
  }
}

# Create the Lambda code directory
resource "null_resource" "lambda_dir" {
  provisioner "local-exec" {
    command = "mkdir -p ${path.module}/lambda"
  }
}

# Create the Lambda code file
resource "local_file" "lambda_code" {
  depends_on = [null_resource.lambda_dir]
  
  content = <<EOF
'use strict';

exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    // Set security headers
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubdomains; preload'
    }];
    
    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    }];
    
    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];
    
    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];
    
    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];
    
    headers['referrer-policy'] = [{
        key: 'Referrer-Policy',
        value: 'same-origin'
    }];
    
    headers['permissions-policy'] = [{
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
    }];

    // Return the modified response
    callback(null, response);
};
EOF

  filename = "${path.module}/lambda/index.js"
}

# Zip the Lambda code
resource "null_resource" "lambda_zip" {
  depends_on = [local_file.lambda_code]
  
  provisioner "local-exec" {
    command = "cd ${path.module}/lambda && zip -r security-headers.zip index.js"
  }

  # Create a trigger to force recreation when the code changes
  triggers = {
    code_content = local_file.lambda_code.content
  }
}

# Update CloudFront distribution to use the Lambda@Edge function
resource "aws_cloudfront_distribution" "website" {
  # This is already defined in cloudfront.tf, so we'll update it there
  # This is just a reference to show what to add
  
  # default_cache_behavior {
  #   # ... existing config
  #   
  #   lambda_function_association {
  #     event_type   = "origin-response"
  #     lambda_arn   = aws_lambda_function.security_headers.qualified_arn
  #     include_body = false
  #   }
  # }
}

# Add AWS Provider configuration for us-east-1 region (required for Lambda@Edge)
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
} 
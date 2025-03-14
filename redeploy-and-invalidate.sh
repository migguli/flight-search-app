#!/bin/bash

# This script forces a complete redeployment and cache invalidation to fix 304 issues

# Define AWS profile
AWS_PROFILE="flight-search-app"

# Load environment variables from .env.local
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local"
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Error: .env.local file not found"
  exit 1
fi

# Check if required environment variables are set
if [ -z "$AWS_REGION" ] || [ -z "$AWS_S3_BUCKET" ] || [ -z "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Error: Required AWS environment variables are not set in .env.local"
  exit 1
fi

echo "=== FIXING 304 ISSUE ==="
echo "This script will force CloudFront to serve fresh content"

# 1. Update the S3 metadata for all files to force cache invalidation
echo "Updating all S3 object metadata..."
aws s3 cp s3://$AWS_S3_BUCKET/ s3://$AWS_S3_BUCKET/ \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "no-cache, no-store, must-revalidate" \
  --expires "0" \
  --profile $AWS_PROFILE

# 2. Create a complete CloudFront invalidation
echo "Creating CloudFront invalidation for ALL paths..."
aws cloudfront create-invalidation \
  --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*" \
  --profile $AWS_PROFILE

echo "=== PROCESS COMPLETE ==="
echo "The cache invalidation has been initiated. It may take 5-15 minutes to fully propagate."
echo "If you still experience 304 issues after this time, please contact the development team."

echo "CloudFront Distribution URL:"
WEBSITE_URL=$(cd terraform && terraform output -raw website_url 2>/dev/null)
if [ -n "$WEBSITE_URL" ]; then
  echo "$WEBSITE_URL"
fi

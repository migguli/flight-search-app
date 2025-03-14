#!/bin/bash

# Script to update .env.local with CloudFront distribution ID

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Updating .env.local with CloudFront distribution ID for $ENVIRONMENT environment..."

# Go to the environment directory
cd "$PROJECT_ROOT/terraform/environments/$ENVIRONMENT"

# Get the CloudFront distribution ID
CLOUDFRONT_DIST_ID=$(asdf exec tofu output -raw cloudfront_distribution_id)

if [ -z "$CLOUDFRONT_DIST_ID" ]; then
  echo "Error: Could not retrieve CloudFront distribution ID. Make sure the infrastructure has been deployed."
  exit 1
fi

echo "Found CloudFront distribution ID: $CLOUDFRONT_DIST_ID"

# Update .env.local file
ENV_FILE="$PROJECT_ROOT/.env.local"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE does not exist. Please create it first."
  exit 1
fi

# Replace or add the CloudFront distribution ID
if grep -q "AWS_CLOUDFRONT_DISTRIBUTION_ID" "$ENV_FILE"; then
  # Replace existing entry
  sed -i'' -e "s|AWS_CLOUDFRONT_DISTRIBUTION_ID=.*|AWS_CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DIST_ID|" "$ENV_FILE"
else
  # Add new entry
  echo "AWS_CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_DIST_ID" >> "$ENV_FILE"
fi

echo "Updated $ENV_FILE with CloudFront distribution ID."

# Get the CloudFront domain name
CLOUDFRONT_DOMAIN=$(asdf exec tofu output -raw cloudfront_domain_name)

echo "Your application will be available at: https://$CLOUDFRONT_DOMAIN"
echo "Don't forget to invalidate the CloudFront cache after deployment:"
echo "aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths \"/*\"" 
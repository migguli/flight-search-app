#!/bin/bash

# Flight Search App Deployment Script (Simplified)

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Deploying Flight Search App to $ENVIRONMENT environment..."

# Build the Next.js application
echo "Building the application..."
npm run build

# Set S3 bucket name based on environment
if [ "$ENVIRONMENT" = "dev" ]; then
  S3_BUCKET="flight-search-app-dev"
else
  S3_BUCKET="flight-search-app-prod"
fi

# Deploy build files to S3
echo "Deploying build files to S3 bucket: $S3_BUCKET..."
aws s3 sync "$PROJECT_ROOT/out" "s3://$S3_BUCKET" --delete

echo "Deployment complete!"
echo "Your application should be available at the S3 website endpoint or CloudFront distribution." 
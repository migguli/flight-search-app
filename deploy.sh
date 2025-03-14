#!/bin/bash

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
if [ -z "$AWS_REGION" ] || [ -z "$AWS_S3_BUCKET" ]; then
  echo "Error: Required AWS environment variables are not set in .env.local"
  exit 1
fi

# Check if we need to initialize the infrastructure
if [ "$1" == "init" ]; then
  echo "Initializing Terraform infrastructure..."
  cd terraform
  terraform init
  terraform apply -auto-approve
  cd ..
  
  # Get S3 bucket name and CloudFront distribution ID from Terraform outputs
  export AWS_S3_BUCKET=$(cd terraform && terraform output -raw s3_bucket_name)
  export AWS_CLOUDFRONT_DISTRIBUTION_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)
  
  # Update .env.local with the new values
  sed -i '' "s/AWS_S3_BUCKET=.*/AWS_S3_BUCKET=$AWS_S3_BUCKET/" .env.local
  sed -i '' "s/AWS_CLOUDFRONT_DISTRIBUTION_ID=.*/AWS_CLOUDFRONT_DISTRIBUTION_ID=$AWS_CLOUDFRONT_DISTRIBUTION_ID/" .env.local
  
  echo "Updated .env.local with the new S3 bucket and CloudFront distribution"
fi

# Build and export the Next.js app
echo "Building Next.js app..."
npm run export

# Deploy to S3
echo "Deploying to S3 bucket: $AWS_S3_BUCKET"
aws s3 sync out/ s3://$AWS_S3_BUCKET --delete --profile $AWS_PROFILE

# Invalidate CloudFront cache if the distribution ID is set
if [ -n "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Invalidating CloudFront cache for distribution: $AWS_CLOUDFRONT_DISTRIBUTION_ID"
  aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile $AWS_PROFILE
else
  echo "Skipping CloudFront invalidation (AWS_CLOUDFRONT_DISTRIBUTION_ID not set)"
fi

echo "Deployment completed!"

# Print the website URL
if [ -n "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  WEBSITE_URL=$(cd terraform && terraform output -raw website_url 2>/dev/null)
  if [ -n "$WEBSITE_URL" ]; then
    echo "Website URL: $WEBSITE_URL"
  fi
fi 
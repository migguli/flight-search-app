# AWS IAM Policy for Flight Search App

This document provides instructions on how to apply the IAM policy needed for deploying the Flight Search App infrastructure using OpenTofu.

## Policy Details

The policy `flight-search-app-policy.json` provides the following permissions:

- Full access to specific S3 buckets (`flight-search-app-dev` and `flight-search-app-prod`)
- Ability to list all S3 buckets and get bucket locations
- Full access to CloudFront distributions
- Read access to IAM roles for service integration
- Read access to ACM certificates for HTTPS

## How to Apply the Policy

### Using the AWS Console

1. Sign in to the AWS Management Console
2. Go to the IAM service
3. Click on "Policies" in the left navigation panel
4. Click "Create policy"
5. Select the "JSON" tab
6. Copy and paste the contents of `flight-search-app-policy.json`
7. Click "Next: Tags"
8. (Optional) Add tags if needed
9. Click "Next: Review"
10. Name the policy `FlightSearchAppDeploymentPolicy`
11. Add a description: "Policy to allow deployment of Flight Search App infrastructure"
12. Click "Create policy"

### Attach the Policy to a User

1. Go to the IAM service in the AWS Console
2. Click on "Users" in the left navigation panel
3. Click on the username `hackaton_flightplanner` (or the relevant user)
4. Click "Add permissions"
5. Select "Attach existing policies directly"
6. Search for `FlightSearchAppDeploymentPolicy`
7. Select the policy
8. Click "Next: Review"
9. Click "Add permissions"

### Using the AWS CLI

1. Save the policy as a JSON file:
   ```
   cat > flight-search-app-policy.json
   # Paste the policy content here
   # Press Ctrl+D to save
   ```

2. Create the policy:
   ```
   aws iam create-policy \
     --policy-name FlightSearchAppDeploymentPolicy \
     --policy-document file://flight-search-app-policy.json
   ```

3. Attach the policy to the user:
   ```
   aws iam attach-user-policy \
     --user-name hackaton_flightplanner \
     --policy-arn arn:aws:iam::ACCOUNT_ID:policy/FlightSearchAppDeploymentPolicy
   ```
   (Replace ACCOUNT_ID with your AWS account ID)

## After Applying the Policy

After the policy is applied, the IAM user will have the necessary permissions to:
- Create and manage S3 buckets for static website hosting
- Create and manage CloudFront distributions
- Deploy the Flight Search App infrastructure using OpenTofu

## Verification

To verify that the policy has been applied correctly:

1. Run the following command:
   ```
   aws s3 ls
   ```
   You should now be able to list all S3 buckets.

2. Try to get the bucket information:
   ```
   aws s3api get-bucket-location --bucket flight-search-app-dev
   ```
   This should return the region where the bucket is located.

3. Try to list CloudFront distributions:
   ```
   aws cloudfront list-distributions
   ```
   This should return a list of your CloudFront distributions.

## Next Steps

After applying the policy, you can proceed with deploying the infrastructure:

```
cd terraform/environments/dev
asdf exec tofu init
asdf exec tofu apply
```

This will create or update the S3 bucket and CloudFront distribution. After the deployment, you can get the CloudFront distribution ID from the output and update your `.env.local` file. 
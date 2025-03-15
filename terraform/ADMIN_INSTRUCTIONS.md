# AWS Administrator Instructions

The following instructions are for AWS administrators to set up the proper permissions and resources for the Flight Search App's Terraform configuration.

## 1. Apply IAM Policy

The IAM user `hackaton_flightplanner` needs additional permissions to create and manage a dedicated Terraform state bucket. We've created a comprehensive policy in `combined-policy.json` that includes all necessary permissions.

To apply this policy:

```bash
# Create policy (if it doesn't exist)
aws iam create-policy \
    --policy-name FlightSearchAppPolicy \
    --policy-document file://combined-policy.json

# Attach policy to user
aws iam attach-user-policy \
    --user-name hackaton_flightplanner \
    --policy-arn arn:aws:iam::646678986868:policy/FlightSearchAppPolicy
```

## 2. Create the Terraform State Bucket

Alternatively, you can create the state bucket on behalf of the user:

```bash
# Create bucket
aws s3api create-bucket \
    --bucket flight-search-app-tfstate \
    --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket flight-search-app-tfstate \
    --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
    --bucket flight-search-app-tfstate \
    --server-side-encryption-configuration '{
      "Rules": [
        {
          "ApplyServerSideEncryptionByDefault": {
            "SSEAlgorithm": "AES256"
          }
        }
      ]
    }'
```

## 3. Create DynamoDB Table for State Locking (Optional)

For state locking:

```bash
aws dynamodb create-table \
    --table-name terraform-state-lock \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

## 4. Update Terraform Configuration

After the state bucket is created, update the backend configuration in `provider.tf`:

```hcl
backend "s3" {
  bucket = "flight-search-app-tfstate"
  key    = "terraform.tfstate"
  region = "us-east-1"
  # Uncomment if you're using DynamoDB for state locking
  # dynamodb_table = "terraform-state-lock"
  # encrypt        = true
}
```

And initialize Terraform with the new backend:

```bash
tofu init -reconfigure
``` 
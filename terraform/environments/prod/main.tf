terraform { backend "local" { path = "terraform.prod.tfstate" } }

module "s3_hosting" {
  source = "../../modules/s3_hosting"

  bucket_name = "flight-search-app-prod"
  environment = "prod"
}

module "cloudfront" {
  source = "../../modules/cloudfront"

  bucket_regional_domain_name = module.s3_hosting.bucket_regional_domain_name
  environment                 = "prod"
}

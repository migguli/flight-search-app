resource "aws_acm_certificate" "cert" {
  count = var.create_dns_record && var.domain_name != "" ? 1 : 0
  
  domain_name       = var.domain_name
  validation_method = "DNS"
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  count = var.create_dns_record && var.domain_name != "" ? length(aws_acm_certificate.cert[0].domain_validation_options) : 0
  
  zone_id    = var.hosted_zone_id
  name       = element(aws_acm_certificate.cert[0].domain_validation_options.*.resource_record_name, count.index)
  type       = element(aws_acm_certificate.cert[0].domain_validation_options.*.resource_record_type, count.index)
  records    = [element(aws_acm_certificate.cert[0].domain_validation_options.*.resource_record_value, count.index)]
  ttl        = 60
}

resource "aws_acm_certificate_validation" "cert" {
  count = var.create_dns_record && var.domain_name != "" ? 1 : 0
  
  certificate_arn         = aws_acm_certificate.cert[0].arn
  validation_record_fqdns = aws_route53_record.cert_validation.*.fqdn
}

resource "aws_route53_record" "website" {
  count = var.create_dns_record && var.domain_name != "" ? 1 : 0
  
  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"
  
  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
} 
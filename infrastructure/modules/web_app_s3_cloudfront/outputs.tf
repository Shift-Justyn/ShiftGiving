output "s3_bucket_name" {
  description = "The name of the S3 bucket hosting the Web app."
  value       = aws_s3_bucket.static_site_bucket.bucket
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.static_site_distribution.domain_name
}

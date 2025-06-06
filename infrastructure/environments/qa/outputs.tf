output "api_alb_dns_name" {
  description = "The DNS name of the API Application Load Balancer."
  value       = module.api_ecs_service.alb_dns_name
}

output "api_ecr_repository_url" {
  description = "The URL of the API ECR repository."
  value       = module.api_ecs_service.ecr_repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster."
  value       = module.ecs_cluster.ecs_cluster_name
}

output "web_app_cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution for the Web app."
  value       = module.web_app_static_site.cloudfront_domain_name
}

output "web_app_s3_bucket_name" {
  description = "The name of the S3 bucket hosting the Web app."
  value       = module.web_app_static_site.s3_bucket_name
}

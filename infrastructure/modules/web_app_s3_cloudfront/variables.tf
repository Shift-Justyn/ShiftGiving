variable "project_name" {
  description = "The base name for naming resources."
  type        = string
}

variable "aws_region" {
  description = "The AWS region where resources are deployed (used for S3 bucket regional domain name)."
  type        = string
}

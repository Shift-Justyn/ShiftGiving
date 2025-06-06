variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "A unique name for the project, prefixed by environment."
  type        = string
}

variable "api_container_image" {
  description = "The ECR image URI for the API."
  type        = string
}

variable "api_container_port" {
  description = "The port the API container listens on."
  type        = number
  default     = 80
}

variable "api_desired_task_count" {
  description = "The desired number of tasks to run for the API."
  type        = number
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
}

variable "public_subnet_cidrs" {
  description = "A list of CIDR blocks for public subnets."
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "A list of CIDR blocks for private subnets."
  type        = list(string)
}

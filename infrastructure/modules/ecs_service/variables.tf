variable "project_name" {
  description = "The base name for naming resources."
  type        = string
}

variable "aws_region" {
  description = "The AWS region where resources are deployed."
  type        = string
}

variable "ecs_cluster_id" {
  description = "The ID of the ECS cluster."
  type        = string
}

variable "ecs_cluster_name" {
  description = "The name of the ECS cluster."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for ECS tasks."
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "A list of public subnet IDs for ALB."
  type        = list(string)
}

variable "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role."
  type        = string
}

variable "ecs_task_role_arn" {
  description = "The ARN of the ECS task role (for application permissions)."
  type        = string
}

variable "container_image" {
  description = "The ECR image URI for the container."
  type        = string
}

variable "container_port" {
  description = "The port the container listens on."
  type        = number
}

variable "container_cpu" {
  description = "The CPU units for the container (Fargate minimum is 256)."
  type        = number
  default     = 256
}

variable "container_memory" {
  description = "The memory (in MiB) for the container (Fargate minimum is 512)."
  type        = number
  default     = 512
}

variable "desired_task_count" {
  description = "The desired number of tasks to run."
  type        = number
}

variable "service_name_suffix" {
  description = "A suffix to make resource names unique for this service (e.g., 'api', 'web')."
  type        = string
}

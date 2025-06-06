module "vpc" {
  source = "../../modules/vpc"

  project_name = var.project_name
  aws_region   = var.aws_region
  vpc_cidr     = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

module "ecs_cluster" {
  source = "../../modules/ecs_cluster"

  project_name = var.project_name
}

module "api_ecs_service" {
  source = "../../modules/ecs_service"

  project_name                = var.project_name
  aws_region                  = var.aws_region
  ecs_cluster_id              = module.ecs_cluster.ecs_cluster_id
  ecs_cluster_name            = module.ecs_cluster.ecs_cluster_name
  vpc_id                      = module.vpc.vpc_id
  private_subnet_ids          = module.vpc.private_subnet_ids
  public_subnet_ids           = module.vpc.public_subnet_ids
  ecs_task_execution_role_arn = module.ecs_cluster.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.ecs_cluster.ecs_task_role_arn
  container_image             = var.api_container_image
  container_port              = var.api_container_port
  desired_task_count          = var.api_desired_task_count
  service_name_suffix         = "api"
}

module "web_app_static_site" {
  source = "../../modules/web_app_s3_cloudfront"

  project_name        = var.project_name
  aws_region          = var.aws_region
}

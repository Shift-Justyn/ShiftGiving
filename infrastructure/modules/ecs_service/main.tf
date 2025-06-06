resource "aws_ecr_repository" "app_repo" {
  name                 = "${var.project_name}-${var.service_name_suffix}-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-repo"
  }
}

resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/ecs/${var.project_name}-${var.service_name_suffix}"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-logs"
  }
}

resource "aws_security_group" "alb_sg" {
  name        = "${var.project_name}-${var.service_name_suffix}-alb-sg"
  description = "Allow HTTP/HTTPS traffic to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-alb-sg"
  }
}

resource "aws_security_group" "ecs_tasks_sg" {
  name        = "${var.project_name}-${var.service_name_suffix}-tasks-sg"
  description = "Allow traffic from ALB to ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-tasks-sg"
  }
}

resource "aws_lb" "app_alb" {
  name               = "${var.project_name}-${var.service_name_suffix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.public_subnet_ids

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-alb"
  }
}

resource "aws_lb_target_group" "app_tg" {
  name        = "${var.project_name}-${var.service_name_suffix}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-tg"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-http-listener"
  }
}

resource "aws_ecs_task_definition" "app_task_def" {
  family                   = "${var.project_name}-${var.service_name_suffix}-task"
  cpu                      = var.container_cpu
  memory                   = var.container_memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([
    {
      name        = "${var.project_name}-${var.service_name_suffix}-container"
      image       = var.container_image
      cpu         = var.container_cpu
      memory      = var.container_memory
      essential   = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.container_port}/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-task-def"
  }
}

resource "aws_ecs_service" "app_service" {
  name            = "${var.project_name}-${var.service_name_suffix}-service"
  cluster         = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.app_task_def.arn
  desired_count   = var.desired_task_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "${var.project_name}-${var.service_name_suffix}-container"
    container_port   = var.container_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  tags = {
    Name = "${var.project_name}-${var.service_name_suffix}-service"
  }
}

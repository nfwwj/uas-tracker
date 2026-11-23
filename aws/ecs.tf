data "aws_ecr_image" "image" {
  repository_name = aws_ecr_repository.app.name
  most_recent     = true
}

resource "aws_cloudwatch_log_group" "app" {
  name              = "ecs/airtrack"
  retention_in_days = 7
}

resource "aws_ecs_cluster" "cluster" {
  name = "airtrack"
}

resource "aws_ecs_task_definition" "task" {
  family                   = "airtrack"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.task_execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name         = "app"
      image        = "${aws_ecr_repository.app.repository_url}@${data.aws_ecr_image.image.image_digest}"
      essential    = true
      portMappings = [{ containerPort = 3000, protocol = "tcp" }]


      secrets = [
        { name = "DATABASE_URL", valueFrom = "${aws_secretsmanager_secret.DATABASE_URL.arn}:DATABASE_URL::"},
        { name = "JWT_SECRET", valueFrom = "${aws_secretsmanager_secret.JWT_SECRET.arn}:JWT_SECRET::" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = "ap-southeast-1"
          awslogs-stream-prefix = "app"
        }
      }

    }
  ])
}

resource "aws_ecs_service" "service" {
  name                              = "airtrack"
  cluster                           = aws_ecs_cluster.cluster.id
  task_definition                   = aws_ecs_task_definition.task.arn
  desired_count                     = 1
  health_check_grace_period_seconds = 90
  # depends_on = [
  #   aws_ecs_cluster.cluster,
  #   aws_ecs_task_definition.task,
  #   aws_lb_target_group.alb-tg,
  # ]
  depends_on  = [aws_lb_listener.alb-listener]
  launch_type = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.task.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.alb-tg.arn
    container_name   = "app"
    container_port   = 3000
  }
}

output "latest_image" {
  value = "image: ${aws_ecr_repository.app.repository_url}@${data.aws_ecr_image.image.image_digest}"
}















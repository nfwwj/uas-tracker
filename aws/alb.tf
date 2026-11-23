resource "aws_lb" "alb" {
  name                       = "airtrack-alb"
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [aws_security_group.alb.id]
  subnets                    = data.aws_subnets.default.ids
}

resource "aws_lb_target_group" "alb-tg" {
  name        = "airtrack-alb-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default.id

  health_check {
    enabled  = true
    path     = "/api/health"
    port     = 3000
    protocol = "HTTP"
  }

}

resource "aws_lb_listener" "alb-listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb-tg.arn
  }
}
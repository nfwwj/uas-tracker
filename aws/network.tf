data "aws_vpc" "default" {
  default = true
}

# "id" = "vpc-00475d0310c0f95f4"
data "aws_subnets" "default" {
    filter {
        name   = "vpc-id"
        values = [data.aws_vpc.default.id]
  }
}

output "subnets"{
    value = data.aws_subnets.default
}

data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

# ALB: accepts HTTP only from CloudFront
resource "aws_security_group" "alb" {
  name   = "alb-sg"
  vpc_id = data.aws_vpc.default.id
}

resource "aws_vpc_security_group_ingress_rule" "alb-sg-in" {
    description = "inbound SG for ALB - only allow http (port 80) traffic fm cloudfront (thru prefix list)"
    security_group_id = aws_security_group.alb.id
    prefix_list_id    = data.aws_ec2_managed_prefix_list.cloudfront.id
    ip_protocol       = "tcp"
    from_port         = 80
    to_port           = 80
}

resource "aws_vpc_security_group_egress_rule" "alb-sg-out" {
    description = "outbound SG for ALB - only forwards traffic to task SG, on port 3000"
    security_group_id = aws_security_group.alb.id
    referenced_security_group_id = aws_security_group.task.id
    ip_protocol    = "tcp"
    from_port      = 3000
    to_port        = 3000
}

resource "aws_security_group" "task" {
    name = "task-sg"
    vpc_id      = data.aws_vpc.default.id

}

resource "aws_vpc_security_group_ingress_rule" "task-sg-in"{
    description = "inbound SG for task - only accepts traffic into port 3000, from ALB SG"
    security_group_id = aws_security_group.task.id
    referenced_security_group_id = aws_security_group.alb.id
    ip_protocol = "tcp"
    from_port   = 3000
    to_port     = 3000
}


resource "aws_vpc_security_group_egress_rule" "task-sg-out"{
    description = "outbound SG for task - open all port"
    security_group_id = aws_security_group.task.id
    cidr_ipv4         = "0.0.0.0/0"
    ip_protocol       = "-1"
}

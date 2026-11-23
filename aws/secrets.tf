resource "aws_secretsmanager_secret" "DATABASE_URL" {
  name = "airtrack/DATABASE_URL"
}

resource "aws_secretsmanager_secret" "JWT_SECRET" {
  name = "airtrack/JWT_SECRET"
}
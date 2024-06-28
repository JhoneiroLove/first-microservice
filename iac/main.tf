provider "aws" {
  region      = var.aws_region
  access_key  = var.aws_access_key
  secret_key  = var.aws_secret_key
  max_retries = 2

  default_tags {
    tags = var.tags[local.env_name]
  }
}

resource "aws_dynamodb_table" "eventos" {
  name           = "eventos"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "UserId"
  range_key      = "EventoId"

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "EventoId"
    type = "S"
  }

  attribute {
    name = "MascotaNombre"
    type = "S"
  }

  global_secondary_index {
    name               = "MascotaNombreIndex"
    hash_key           = "MascotaNombre"
    range_key          = "UserId"
    projection_type    = "ALL"
  }

  tags = {
    department   = "Innovation"
    environment  = "development"
    owner        = "jmaquis"
  }
}

resource "aws_dynamodb_table" "complementos" {
  name           = "complementos"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "ID"

  attribute {
    name = "ID"
    type = "S"
  }
}

resource "aws_s3_bucket" "archivos_eventos" {
  bucket = "archivos-eventos"
  acl    = "private"

  force_destroy = true

  tags = {
    Name        = "archivos-eventos"
    Environment = "Dev"
  }
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_caller_identity" "current" {}
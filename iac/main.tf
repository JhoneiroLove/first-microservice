provider "aws" {
  region      = var.aws_region
  profile     = var.aws_role[local.env_name]
  max_retries = 2

  default_tags {
    tags = var.tags[local.env_name]
  }
}

resource "aws_dynamodb_table" "eventos" {
  name           = "eventos"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "ID"

  attribute {
    name = "ID"
    type = "S"
  }

  attribute {
    name = "UsuarioId"
    type = "S"
  }

  global_secondary_index {
    name            = "UsuarioIndex"
    hash_key        = "UsuarioId"
    projection_type = "ALL"
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
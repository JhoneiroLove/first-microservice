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
}

resource "aws_s3_bucket_acl" "archivos_eventos_acl" {
  bucket = aws_s3_bucket.archivos_eventos.bucket
  acl    = "private"
}

data "aws_caller_identity" "current" {}

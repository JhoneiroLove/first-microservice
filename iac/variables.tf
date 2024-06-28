variable "tags" {}
variable "aws_role" {
  description = "AWS Role"
  type        = map(string)
}

variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-2"
}

locals {
  env_name = "local"
}

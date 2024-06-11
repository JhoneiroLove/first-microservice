data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "development_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "../src"
  output_path = "bin/lambda_function_payload.zip"
}

resource "aws_iam_role_policy" "lambda_s3_policy" {
  name = "lambda_s3_policy"
  role = aws_iam_role.iam_for_lambda.id

  policy = <<EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem"
        ],
        "Resource": [
          "arn:aws:s3:::${aws_s3_bucket.archivos_eventos.bucket}/*",
          "arn:aws:s3:::${aws_s3_bucket.archivos_eventos.bucket}",
          "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${aws_dynamodb_table.eventos.name}",
          "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${aws_dynamodb_table.complementos.name}"
        ]
      }
    ]
  }
  EOF
}

resource "aws_lambda_function" "registrar_evento" {
  filename      = data.archive_file.lambda.output_path
  function_name = "registrar_evento"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "handlers/registrarEvento.handler"
  runtime       = "nodejs18.x"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      EVENTOS_TABLE      = aws_dynamodb_table.eventos.name
      COMPLEMENTOS_TABLE = aws_dynamodb_table.complementos.name
      S3_BUCKET          = aws_s3_bucket.archivos_eventos.bucket
    }
  }
}

resource "aws_lambda_function" "obtener_eventos_por_usuario" {
  filename      = data.archive_file.lambda.output_path
  function_name = "obtener_eventos_por_usuario"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "handlers/obtenerEventosPorUsuario.handler"
  runtime       = "nodejs18.x"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      EVENTOS_TABLE = aws_dynamodb_table.eventos.name
    }
  }
}

resource "aws_lambda_function" "eliminar_evento" {
  filename      = data.archive_file.lambda.output_path
  function_name = "eliminar_evento"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "handlers/eliminarEvento.handler"
  runtime       = "nodejs18.x"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      EVENTOS_TABLE = aws_dynamodb_table.eventos.name
    }
  }
}

resource "aws_lambda_function" "actualizar_fecha_evento" {
  filename      = data.archive_file.lambda.output_path
  function_name = "actualizar_fecha_evento"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "handlers/actualizarFechaEvento.handler"
  runtime       = "nodejs18.x"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      EVENTOS_TABLE = aws_dynamodb_table.eventos.name
    }
  }
}

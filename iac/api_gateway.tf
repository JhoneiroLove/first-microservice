resource "aws_api_gateway_rest_api" "evento_api" {
  name        = "EventoAPI"
  description = "API para el servicio de eventos"
}

resource "aws_api_gateway_resource" "evento" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  parent_id   = aws_api_gateway_rest_api.evento_api.root_resource_id
  path_part   = "evento"
}

# POST - registrar_evento
resource "aws_api_gateway_method" "registrar_evento" {
  rest_api_id   = aws_api_gateway_rest_api.evento_api.id
  resource_id   = aws_api_gateway_resource.evento.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "registrar_evento" {
  rest_api_id             = aws_api_gateway_rest_api.evento_api.id
  resource_id             = aws_api_gateway_resource.evento.id
  http_method             = aws_api_gateway_method.registrar_evento.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.registrar_evento.invoke_arn
}

resource "aws_api_gateway_method_response" "registrar_evento_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.registrar_evento.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "registrar_evento_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.registrar_evento.http_method
  status_code = aws_api_gateway_method_response.registrar_evento_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }

  depends_on = [
    aws_api_gateway_integration.registrar_evento
  ]
}

resource "aws_lambda_permission" "registrar_evento_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.registrar_evento.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.evento_api.execution_arn}/*/*"
}

# DELETE - eliminar_evento
resource "aws_api_gateway_method" "eliminar_evento" {
  rest_api_id   = aws_api_gateway_rest_api.evento_api.id
  resource_id   = aws_api_gateway_resource.evento.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "eliminar_evento" {
  rest_api_id             = aws_api_gateway_rest_api.evento_api.id
  resource_id             = aws_api_gateway_resource.evento.id
  http_method             = aws_api_gateway_method.eliminar_evento.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.eliminar_evento.invoke_arn
}

resource "aws_api_gateway_method_response" "eliminar_evento_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.eliminar_evento.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "eliminar_evento_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.eliminar_evento.http_method
  status_code = aws_api_gateway_method_response.eliminar_evento_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }

  depends_on = [
    aws_api_gateway_integration.eliminar_evento
  ]
}

resource "aws_lambda_permission" "eliminar_evento_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.eliminar_evento.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.evento_api.execution_arn}/*/*"
}

# PUT - actualizar_fecha_evento
resource "aws_api_gateway_method" "actualizar_fecha_evento" {
  rest_api_id   = aws_api_gateway_rest_api.evento_api.id
  resource_id   = aws_api_gateway_resource.evento.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "actualizar_fecha_evento" {
  rest_api_id             = aws_api_gateway_rest_api.evento_api.id
  resource_id             = aws_api_gateway_resource.evento.id
  http_method             = aws_api_gateway_method.actualizar_fecha_evento.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.actualizar_fecha_evento.invoke_arn
}

resource "aws_api_gateway_method_response" "actualizar_fecha_evento_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.actualizar_fecha_evento.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "actualizar_fecha_evento_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.actualizar_fecha_evento.http_method
  status_code = aws_api_gateway_method_response.actualizar_fecha_evento_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }

  depends_on = [
    aws_api_gateway_integration.actualizar_fecha_evento
  ]
}

resource "aws_lambda_permission" "actualizar_fecha_evento_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.actualizar_fecha_evento.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.evento_api.execution_arn}/*/*"
}

# GET - obtener_eventos_por_usuario
resource "aws_api_gateway_method" "obtener_eventos_por_usuario" {
  rest_api_id   = aws_api_gateway_rest_api.evento_api.id
  resource_id   = aws_api_gateway_resource.evento.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "obtener_eventos_por_usuario" {
  rest_api_id             = aws_api_gateway_rest_api.evento_api.id
  resource_id             = aws_api_gateway_resource.evento.id
  http_method             = aws_api_gateway_method.obtener_eventos_por_usuario.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.obtener_eventos_por_usuario.invoke_arn
}

resource "aws_api_gateway_method_response" "obtener_eventos_por_usuario_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.obtener_eventos_por_usuario.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "obtener_eventos_por_usuario_200" {
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  resource_id = aws_api_gateway_resource.evento.id
  http_method = aws_api_gateway_method.obtener_eventos_por_usuario.http_method
  status_code = aws_api_gateway_method_response.obtener_eventos_por_usuario_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  response_templates = {
    "application/json" = ""
  }

  depends_on = [
    aws_api_gateway_integration.obtener_eventos_por_usuario
  ]
}

resource "aws_lambda_permission" "obtener_eventos_por_usuario_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.obtener_eventos_por_usuario.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.evento_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "evento_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.registrar_evento,
    aws_api_gateway_integration.eliminar_evento,
    aws_api_gateway_integration.actualizar_fecha_evento,
    aws_api_gateway_integration.obtener_eventos_por_usuario
  ]
  rest_api_id = aws_api_gateway_rest_api.evento_api.id
  stage_name  = "prod"
}

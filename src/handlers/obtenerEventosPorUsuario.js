const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Obtenemos usuarioId de los parámetros de consulta
    const usuarioId = event.queryStringParameters && event.queryStringParameters.usuarioId;

    if (!usuarioId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'UsuarioId es requerido' }),
        };
    }

    const params = {
        TableName: process.env.EVENTOS_TABLE,
        IndexName: 'UsuarioIndex',
        KeyConditionExpression: 'UsuarioId = :usuarioId',
        ExpressionAttributeValues: {
            ':usuarioId': usuarioId
        }
    };

    try {
        const result = await dynamodb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al obtener los eventos', error }),
        };
    }
};

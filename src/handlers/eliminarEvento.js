const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));

    // Obtener y decodificar el token JWT
    const token = event.headers.Authorization.replace("Bearer ", "");
    let userId;
    try {
        const decoded = jwt.decode(token);
        userId = decoded.userId.toString();
    } catch (err) {
        console.error('Error decoding token:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid token' })
        };
    }

    // Obtener el eventoId del cuerpo de la solicitud
    let eventoId;
    try {
        const body = JSON.parse(event.body);
        eventoId = body.eventoId;
    } catch (err) {
        console.error('Error parsing body:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body' })
        };
    }

    if (!eventoId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'eventoId is required' })
        };
    }

    // Parámetros para eliminar el evento de DynamoDB
    const params = {
        TableName: process.env.EVENTOS_TABLE,
        Key: {
            UserId: userId,
            EventoId: eventoId
        }
    };

    try {
        await dynamodb.delete(params).promise();
        console.log('Evento eliminado de DynamoDB');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Evento eliminado exitosamente' })
        };
    } catch (error) {
        console.error('Error al eliminar el evento de DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al eliminar el evento' })
        };
    }
};

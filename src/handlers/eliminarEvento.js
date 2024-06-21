const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));
    
    const token = event.headers.Authorization.replace("Bearer ", "");

    let userId;
    try {
        const decoded = jwt.decode(token);
        userId = decoded.userId.toString(); 
        console.log('Decoded userId:', userId);
    } catch (err) {
        console.error('Error decoding token:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid token' })
        };
    }

    let mascotaNombre;
    try {
        const body = JSON.parse(event.body);
        mascotaNombre = body.mascotaNombre;
        console.log('Parsed mascotaNombre:', mascotaNombre);
    } catch (err) {
        console.error('Error parsing event body:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body' })
        };
    }

    if (!mascotaNombre) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'mascotaNombre es requerido' })
        };
    }

    const params = {
        TableName: 'eventos', 
        Key: { 
            UserId: userId, 
            MascotaNombre: mascotaNombre 
        }
    };

    console.log('Params:', JSON.stringify(params)); 

    try {
        await dynamodb.delete(params).promise();
        console.log('Evento eliminado exitosamente');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Evento eliminado' }),
        };
    } catch (error) {
        console.error('Error eliminando evento:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al eliminar el evento', error }),
        };
    }
};

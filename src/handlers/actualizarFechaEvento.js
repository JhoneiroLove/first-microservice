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
    } catch (err) {
        console.error('Error decoding token:', err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid token' })
        };
    }

    const { eventoId, nuevaFecha } = JSON.parse(event.body);
    
    const params = {
        TableName: process.env.EVENTOS_TABLE,
        Key: {
            UserId: userId,
            EventoId: eventoId
        },
        UpdateExpression: 'set Fecha = :nuevaFecha, ModificadoFecha = :modificadoFecha',
        ExpressionAttributeValues: {
            ':nuevaFecha': nuevaFecha,
            ':modificadoFecha': new Date().toISOString()
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await dynamodb.update(params).promise();
        console.log('Update result:', result);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Fecha de evento actualizada', result }),
        };
    } catch (error) {
        console.error('Error updating event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al actualizar la fecha del evento', error }),
        };
    }
};

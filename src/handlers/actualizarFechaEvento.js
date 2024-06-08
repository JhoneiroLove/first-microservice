const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { eventoId, nuevaFecha } = JSON.parse(event.body);

    const params = {
        TableName: process.env.EVENTOS_TABLE,
        Key: { ID: eventoId },
        UpdateExpression: 'set Fecha = :nuevaFecha, ModificadoFecha = :modificadoFecha',
        ExpressionAttributeValues: {
            ':nuevaFecha': nuevaFecha,
            ':modificadoFecha': new Date().toISOString()
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await dynamodb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Fecha de evento actualizada', result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al actualizar la fecha del evento', error }),
        };
    }
};

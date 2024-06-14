const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));
    
    const nombreMascota = event.queryStringParameters.nombreMascota;

    if (!nombreMascota) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'nombreMascota es requerido' })
        };
    }

    const params = {
        TableName: process.env.EVENTOS_TABLE,
        IndexName: 'MascotaNombreIndex',
        KeyConditionExpression: 'MascotaNombre = :nombreMascota',
        ExpressionAttributeValues: {
            ':nombreMascota': nombreMascota
        }
    };

    try {
        const data = await dynamodb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al obtener eventos' })
        };
    }
};

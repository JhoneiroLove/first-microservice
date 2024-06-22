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
        KeyConditionExpression: 'MascotaNombre = :nombreMascota and UserId = :userId',
        ExpressionAttributeValues: {
            ':nombreMascota': nombreMascota,
            ':userId': userId
        }
    };

    try {
        const data = await dynamodb.query(params).promise();
        const items = data.Items.map(item => ({
            eventoId: item.EventoId,
            fecha: item.Fecha,
            veterinaria: item.Veterinaria,
            descripcion: item.Descripcion,
            costo: item.Costo,
            tipoEvento: item.TipoEvento,
            archivo: item.ArchivoUrl,
            nombreMascota: item.MascotaNombre,
            complemento: item.Complemento || null
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al obtener eventos' })
        };
    }
};

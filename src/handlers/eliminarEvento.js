const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { eventoId } = JSON.parse(event.body);

    const params = {
        TableName: process.env.EVENTOS_TABLE,
        Key: { ID: eventoId }
    };

    try {
        await dynamodb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Evento eliminado' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al eliminar el evento', error }),
        };
    }
};

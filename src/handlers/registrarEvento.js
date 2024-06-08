const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { fecha, veterinaria, descripcion, costo, tipoEvento, archivo, mascotaNombre, complementoNombre, tipoComplemento, descripcionComplemento, fechaComplemento, fabricante, lote, dosis, frecuencia } = JSON.parse(event.body);

    const eventoId = uuidv4();
    const complementoId = complementoNombre ? uuidv4() : null;

    let archivoUrl = null;

    if (archivo) {
        const buffer = Buffer.from(archivo, 'base64'); // archivo como base64
        const s3Params = {
            Bucket: process.env.S3_BUCKET,
            Key: `eventos/${eventoId}/${uuidv4()}`, // Carpeta por evento y nombre único
            Body: buffer,
            ContentEncoding: 'base64', // Indicamos que el contenido está en base64
            ContentType: 'application/octet-stream' // Tipo genérico
        };
        const s3Result = await s3.upload(s3Params).promise();
        archivoUrl = s3Result.Location;
    }

    const eventoParams = {
        TableName: process.env.EVENTOS_TABLE,
        Item: {
            ID: eventoId,
            Fecha: fecha,
            Veterinaria: veterinaria,
            Descripcion: descripcion,
            Costo: costo,
            TipoEvento: tipoEvento,
            ArchivoUrl: archivoUrl,
            ModificadoFecha: new Date().toISOString(),
            Enabled: true,
            MascotaNombre: mascotaNombre,
        }
    };

    const complementoParams = complementoNombre ? {
        TableName: process.env.COMPLEMENTOS_TABLE,
        Item: {
            ID: complementoId,
            Nombre: complementoNombre,
            Descripcion: descripcionComplemento,
            Fecha: fechaComplemento,
            EventoId: eventoId,
            TipoComplemento: tipoComplemento,
            Fabricante: fabricante,
            Lote: lote,
            Dosis: dosis,
            Frecuencia: frecuencia,
            Enabled: true,
        }
    } : null;

    try {
        await dynamodb.put(eventoParams).promise();
        if (complementoParams) {
            await dynamodb.put(complementoParams).promise();
        }
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Evento registrado', eventoId, complementoId }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al registrar el evento', error }),
        };
    }
};

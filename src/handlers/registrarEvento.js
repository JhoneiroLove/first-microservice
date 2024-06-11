const dynamodb = require('../utils/dynamodb');
const { uploadFile } = require('../utils/s3');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const { fecha, veterinaria, descripcion, costo, tipoEvento, archivo, mascotaNombre, complementoNombre, tipoComplemento, descripcionComplemento, fechaComplemento, fabricante, lote, dosis, frecuencia } = JSON.parse(event.body);

    const eventoId = uuidv4();
    const complementoId = complementoNombre ? uuidv4() : null;

    let archivoUrl = null;

    if (archivo) {
        const buffer = Buffer.from(archivo, 'base64'); // archivo como base64
        const key = `eventos/${eventoId}/${uuidv4()}`; // Carpeta por evento y nombre único
        await uploadFile(process.env.S3_BUCKET, key, buffer);
        archivoUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
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

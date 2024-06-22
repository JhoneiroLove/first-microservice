const dynamodb = require('../utils/dynamodb');
const { uploadFile } = require('../utils/s3');
const { v4: uuidv4 } = require('uuid');
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

    try {
        const {
            fecha,
            veterinaria,
            descripcion,
            costo,
            tipoEvento,
            archivo,
            nombreMascota,
            tipoMascota,
            nombreComplemento,
            descripcionComplemento,
            tipoComplemento,
            fechaComplemento,
            fabricante,
            lote,
            dosis,
            frecuencia
        } = JSON.parse(event.body);

        console.log('Parsed body:', {
            fecha,
            veterinaria,
            descripcion,
            costo,
            tipoEvento,
            archivo,
            nombreMascota,
            tipoMascota,
            nombreComplemento,
            descripcionComplemento,
            tipoComplemento,
            fechaComplemento,
            fabricante,
            lote,
            dosis,
            frecuencia
        });

        const eventoId = uuidv4();
        const complementoId = nombreComplemento ? uuidv4() : null;
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
                UserId: userId,
                EventoId: eventoId, 
                MascotaNombre: nombreMascota,
                Fecha: fecha,
                Veterinaria: veterinaria,
                Descripcion: descripcion,
                Costo: costo,
                TipoEvento: tipoEvento,
                ArchivoUrl: archivoUrl,
                ModificadoFecha: new Date().toISOString(),
                Enabled: true,
                TipoMascota: tipoMascota
            }
        };

        console.log('Evento Params:', eventoParams);
        try {
            await dynamodb.put(eventoParams).promise();
            console.log('Evento registrado en DynamoDB');
        } catch (dbError) {
            console.error('Error saving event to DynamoDB:', dbError);
            throw new Error('DynamoDB put operation failed');
        }

        if (complementoId) {
            const complementoParams = {
                TableName: process.env.COMPLEMENTOS_TABLE,
                Item: {
                    ID: complementoId,
                    Nombre: nombreComplemento,
                    Descripcion: descripcionComplemento,
                    Fecha: fechaComplemento,
                    EventoId: eventoId,
                    TipoComplemento: tipoComplemento,
                    Fabricante: fabricante,
                    Lote: lote,
                    Dosis: dosis,
                    Frecuencia: frecuencia,
                    Enabled: true
                }
            };
            console.log('Complemento Params:', complementoParams);
            try {
                await dynamodb.put(complementoParams).promise();
                console.log('Complemento registrado en DynamoDB');
            } catch (dbError) {
                console.error('Error saving complemento to DynamoDB:', dbError);
                throw new Error('DynamoDB put operation failed for complemento');
            }
        }

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Evento registrado', eventoId, complementoId }),
        };
    } catch (error) {
        console.error('Error handling event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al registrar el evento', error: error.message }),
        };
    }
};

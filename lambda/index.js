const AWS = require("aws-sdk");
const sharp = require("sharp");

// Usar la variable de entorno de AWS/LocalStack o fallback a 172.17.0.2:4566
const endpoint = process.env.AWS_ENDPOINT_URL ||
    (process.env.LOCALSTACK_HOSTNAME
        ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
        : "http://172.17.0.2:4566");

const s3 = new AWS.S3({
    endpoint: endpoint,
    s3ForcePathStyle: true,
    sslEnabled: false
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
    endpoint: endpoint,
    sslEnabled: false
});

const ORIGINAL_BUCKET = "lomax-originales";
const THUMBNAIL_BUCKET = "lomax-miniaturas";
const TABLE_NAME = "productos";

exports.handler = async (event) => {
    try {
        const producto_id = Number(event.producto_id);
        const originalBucket = event.original_bucket || ORIGINAL_BUCKET;
        const originalKey = event.original_key;

        if (!producto_id || !originalKey) {
            throw new Error("Faltan producto_id u original_key");
        }

        const thumbnailKey = `producto-${producto_id}.png`;

        // 1. Verificar si ya existe en S3
        try {
            await s3.headObject({
                Bucket: THUMBNAIL_BUCKET,
                Key: thumbnailKey
            }).promise();

            await dynamodb.update({
                TableName: TABLE_NAME,
                Key: { producto_id },
                UpdateExpression: "SET #estado = :estado, miniatura = :miniatura",
                ExpressionAttributeNames: { "#estado": "estado" },
                ExpressionAttributeValues: {
                    ":estado": "LISTA",
                    ":miniatura": `s3://${THUMBNAIL_BUCKET}/${thumbnailKey}`
                }
            }).promise();

            return {
                statusCode: 200,
                mensaje: "La miniatura ya existía",
                miniatura: `s3://${THUMBNAIL_BUCKET}/${thumbnailKey}`
            };
        } catch (error) {
            const thumbnailNotFound =
                error.code === "NotFound" ||
                error.code === "NoSuchKey" ||
                error.code === "404" ||
                error.statusCode === 404;

            if (!thumbnailNotFound) {
                throw error;
            }

            console.log("La miniatura no existe, se procede a crearla...");
        }

        // 2. Obtener imagen original
        const original = await s3.getObject({
            Bucket: originalBucket,
            Key: originalKey
        }).promise();

        // 3. Generar miniatura
        const thumbnail = await sharp(original.Body)
            .resize(300, 300, {
                fit: "inside",
                withoutEnlargement: true
            })
            .png()
            .toBuffer();

        // 4. Guardar miniatura en S3
        await s3.putObject({
            Bucket: THUMBNAIL_BUCKET,
            Key: thumbnailKey,
            Body: thumbnail,
            ContentType: "image/png"
        }).promise();

        // 5. Actualizar estado en DynamoDB
        await dynamodb.update({
            TableName: TABLE_NAME,
            Key: { producto_id },
            UpdateExpression: "SET #estado = :estado, miniatura = :miniatura",
            ExpressionAttributeNames: { "#estado": "estado" },
            ExpressionAttributeValues: {
                ":estado": "LISTA",
                ":miniatura": `s3://${THUMBNAIL_BUCKET}/${thumbnailKey}`
            }
        }).promise();

        return {
            statusCode: 200,
            mensaje: "Miniatura generada correctamente",
            producto_id,
            miniatura: `s3://${THUMBNAIL_BUCKET}/${thumbnailKey}`
        };

    } catch (error) {
        console.error("Error en Lambda:", error);

        try {
            const producto_id = Number(event.producto_id);
            if (producto_id) {
                await dynamodb.update({
                    TableName: TABLE_NAME,
                    Key: { producto_id },
                    UpdateExpression: "SET #estado = :estado, error = :error",
                    ExpressionAttributeNames: { "#estado": "estado" },
                    ExpressionAttributeValues: {
                        ":estado": "ERROR",
                        ":error": error.message
                    }
                }).promise();
            }
        } catch (updateError) {
            console.error("No se pudo actualizar DynamoDB:", updateError);
        }

        return {
            statusCode: 500,
            error: error.message
        };
    }
};
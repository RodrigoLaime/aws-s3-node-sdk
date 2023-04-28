// s3Client es el que permite establecer la conexión
// PutObjectAclCommand permite subir un archivo
import {S3Client, PutObjectAclCommand} from "@aws-sdk/client-s3";
// modulo para poder trabajar con archivos de node
import fs from 'fs';

import {AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME} from "./config.js";

// connection aws
const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    }
})

// crear funcion que permita subir archivos
export async function uploadFile(file) {
    // crea un objeto string, el string permite dividir el archivo y subirlo a donde quieras, en este caso aws
    const stream = fs.createReadStream(file.tempFilePath)
    // parametros
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: 'hola.png',
        // Key: file.name,
        Body: stream,   
        ACL: 'public-read',
        // ContentType: file.type
    }
    // describe las operaciones
    const command =  new PutObjectAclCommand(uploadParams)
    const result = await client.send(command)
    console.log(result);
}
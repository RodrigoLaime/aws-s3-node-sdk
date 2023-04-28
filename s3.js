// s3Client es el que permite establecer la conexión
// PutObjectAclCommand permite subir un archivo
// ListObjectsCommand lista todo el contenido de aws
// GetObjectCommand obtine un objeto
import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// modulo para poder trabajar con archivos de node
import fs from 'fs';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } from "./config.js";

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
    // Key: 'hola.png',
    Key: file.name,
    Body: stream,
    // ACL: 'public-read',
    // ContentType: file.type
  }
  // describe las operaciones
  const command = new PutObjectCommand(uploadParams)
  const result = await client.send(command)
  console.log(result);
}

// crear funcion que permita obtener archivos
export async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME
  })
  const result = await client.send(command)
  console.log(result);
  return result;
}

// crear funcion que permita obtener un archivo
export async function getFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename
  })
  // lo envia al cliente
  const result = await client.send(command)
  console.log(result);
  return result;
}

// descargar el archivo
export async function downloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename
  })
  // lo envia al cliente
  const result = await client.send(command)
  console.log(result);
  // se va a guardar dentro de un archivo en mi backend 
  // pipe: transmite lo del Body a otro objecto que se crea en mi backend
  result.Body.pipe(fs.createWriteStream(`./images/${filename}`))
}

// compartir por url
export async function getFileURL(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename
  })
  // lo envia al cliente, el comando y el tiempo de espiracion en segundos
  return await getSignedUrl(client, command, { expiresIn: 3600 })
}
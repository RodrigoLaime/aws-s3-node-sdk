import express from 'express';

import fileUpload from 'express-fileupload';

import {uploadFile} from "./s3.js";

import './config.js'

const app = express();

app.use(fileUpload({
  //para utilizar los archivos que se encuentran aqui mismo
  useTempFiles: true,
  // donde se va guardar
  tempFileDir: './uploads'
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/files', async(req, res) => {
  // res.send(req.files);
  await uploadFile(req.files.file)
  res.json({message: 'upload files'})
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
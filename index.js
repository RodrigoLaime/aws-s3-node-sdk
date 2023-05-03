import express from 'express';

import fileUpload from 'express-fileupload';

import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from "./s3.js";

import './config.js'

const app = express();

app.use(fileUpload({
  //para utilizar los archivos que se encuentran aqui mismo
  useTempFiles: true,
  // donde se va guardar
  tempFileDir: './uploads'
}));

/* app.get('/', (req, res) => {
  res.send('Hello World!');
}); */

app.get('/files', async (req, res) => {
  const result = await getFiles()
  result.Contents.forEach(e => {
    console.log(e.Key)
  });
  res.json(result.Contents)
});

app.get('/files/:fileName', async (req, res) => {
  const result = await getFileURL(req.params.fileName);
  res.send({
    url: result
  });
});

/* app.get('/files/:fileName', async (req, res) => {
  const result = await getFile(req.params.fileName);
  res.json(result.$metadata)
});
 */
app.get('/downloadfile/:fileName', async (req, res) => {
  await downloadFile(req.params.fileName);
  res.json({ message: 'archivo descargado' })
});

app.post('/files', async (req, res) => {
  // res.send(req.files.file);
  await uploadFile(req.files.file)
  res.json({ message: 'upload files' })
});

// para ver en el navegador los que esta en el archivo publico 'images'
app.use(express.static('images'))

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});
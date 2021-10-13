const express = require('express');
const path  = require('path');
const cors = require('cors');
const multer = require('multer');
const handlebars = require('handlebars');
const { log, getFile, getFilesList, writeCommentFile } = require('./utils');

const LOG_FILE_NAME = path.join(__dirname, '_server.log');
const webServer = express();
const PORT = 8180;
const CORS_OPTIONS = {
  origin: '*',
  headers: 'Content-Type',
  optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname,"DB"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({storage});

webServer.set('view engine', 'handlebars');
webServer.set('views', path.join(__dirname, 'views'));

// webServer.use(express.json());
webServer.use((req, res, next) => {
  log(LOG_FILE_NAME, '-request-');
  next();
});

webServer.use('/service5695', express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------ options
webServer.options('/upload', (req, res) => {
  log(LOG_FILE_NAME, 'options request');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});
// ------------------------------------------------------ post

webServer.post('/upload', upload.single('file'), (req, res) => {
  writeCommentFile(path.join(__dirname, 'DB', req.file.originalname + '.comment'), req.body.comment);
  res.status(200).send('Файл загружен');
});

// ------------------------------------------------------ get
webServer.get('/', cors(CORS_OPTIONS), (req, res) => {
  log(LOG_FILE_NAME, 'запрос списка файлов из базы ...');
  getFilesList().then((data) => res.render("filesList.hbs", data));
});


webServer.get('/download', (req, res) => {  
  // res.setHeader("Content-Disposition", `attachment; filename=${req.query.filename}`);
  // res.setHeader("Content-Type", "application/octet-stream");
  // res.send(getFile(req.query.filename));
  res.download(path.join(__dirname, 'DB', req.query.filename), req.query.filename);
});


webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 5695: running on port ${PORT}---`))
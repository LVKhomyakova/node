const express = require('express');
const WebSocket = require('ws');
const path  = require('path');
const cors = require('cors');
const multer = require('multer');
const handlebars = require('handlebars');
const { log, getFile, getFilesList, writeCommentFile } = require('./utils');

const LOG_FILE_NAME = path.join(__dirname, '_server.log');
const webServer = express();
const PORT = 8180;
const PORT_WS = 8181;
const CORS_OPTIONS = {
  origin: '*',
  headers: 'Content-Type',
  optionsSuccessStatus: 200
}

// ---------------------------------WebSocket connection--------------------
const serverWS = new WebSocket.Server({ port: PORT_WS });
let clients = [];
serverWS.on('connection', (connection) => {
  connection.on('message', (message) => {    
    if (message.toString() === 'KEEP_ALIVE')
      clients.find((client) => client.connection === connection).lastkeepalive = Date.now();
    else 
      clients.find((client) => client.connection === connection).connectionId = JSON.parse(message.toString()).connectionId;
  });

  clients.push({connection: connection, lastkeepalive: Date.now(), connectionId: null})
});

setInterval(()=>{
  clients.forEach((client) => {
    if ((Date.now() - client.lastkeepalive) > 5000) { 
      client.connection.terminate();
      client.connection = null;
    }
  });
  clients = clients.filter((client) => client.connection);
}, 1000);
// ------------------------------------***---------------------------------------

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

webServer.post('/upload', progress, upload.single('file'), (req, res) => {
  writeCommentFile(path.join(__dirname, 'DB', req.file.originalname + '.comment'), req.body.comment);
  log(LOG_FILE_NAME, 'upload finished');
  res.status(200).send('Файл загружен');
});

// ------------------------------------------------------ get
webServer.get('/', cors(CORS_OPTIONS), (req, res) => {
  log(LOG_FILE_NAME, 'запрос списка файлов из базы ...');
  getFilesList().then((data) => res.render("filesList.hbs", data));
});


webServer.get('/download', (req, res) => {  
  res.download(path.join(__dirname, 'DB', req.query.filename), req.query.filename);
});

// ------------------------------------------------------ middleware
function progress(req, res, next) {
  log(LOG_FILE_NAME, 'upload started');
  const fileSize = req.headers['content-length'];
  let progress = 0;
  req.on('data', (chunk) => {
    progress = (chunk.length * 100) / fileSize + progress;
    clients.find((client) => client.connectionId === Number(req.headers.connectionid))?.connection?.send(Math.round(progress));
  });
 next();
}

webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 5695: running on port ${PORT}---`))
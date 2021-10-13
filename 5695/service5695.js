const express = require('express');
const path  = require('path');
const { log, uploadFile } = require('./utils');


const webServer = express();
const PORT = 8180;

const LOG_FILE_NAME = path.join(__dirname, '_server.log');

webServer.use('/service5695', express.static(path.join(__dirname, 'public')));

webServer.options('/upload', (req, res) => {
  log(LOG_FILE_NAME, 'options request');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});
webServer.post('/upload', (req, res) => {
  
  res.send('upload');
});

webServer.get('/download', (req, res) => {

  
  res.setHeader("Content-Disposition", `attachment; filename=stat.${fileType}`);
  uploadFile().then((data) => res.send(convertDataTo(data, fileType)));

  res.send('download');
});


webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 5695: running on port ${PORT}---`))
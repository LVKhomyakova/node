const express = require('express');
const path = require('path');
const { log } = require('./utils');

const webServer = express();
const PORT = 8180;
const LOG_FILE_NAME = path.join(__dirname, '_server.log');

webServer.use((req, res, next) => {
  log(LOG_FILE_NAME, '-request-');
  next();
});

webServer.use('/service4095', express.static(path.resolve(__dirname, 'public/postman')));




webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 4095: running on port ${PORT}---`));
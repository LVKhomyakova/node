const express = require('express');
const fetch = require("isomorphic-fetch");
const path = require('path');
const { log } = require('./utils');

const webServer = express();
const PORT = 8180;
const LOG_FILE_NAME = path.join(__dirname, '_server.log');

webServer.use(express.json());
webServer.use((req, res, next) => {
  log(LOG_FILE_NAME, '-request-');
  next();
});

webServer.use('/service4095', express.static(path.resolve(__dirname, 'public/postmanNative')));

webServer.post('/send', async (req, res) => {
  const method = req.body.method;
  const url = req.body.url;
  const headers = req.body.headers;
  const body = req.body.data;

  log(LOG_FILE_NAME, 'sending proxy request...');
  
  // test url
  const urlTest = 'http://217.21.60.255:5000/192.168.13.118:5000/json/reply/GetAllAgeGroups';
  const proxy_response = await fetch(urlTest, {
    method: method,
    headers: {...headers},
    body: method==='POST' ? body : null,
  });

  log(LOG_FILE_NAME, 'recieving proxy response...');
  log(LOG_FILE_NAME, 'sending proxy response...');

  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({data: await proxy_response.text()}));
  log(LOG_FILE_NAME, 'proxy response sended');
});

webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 4095: running on port ${PORT}---`));
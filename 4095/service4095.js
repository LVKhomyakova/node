const express = require('express');
const fetch = require("isomorphic-fetch");
const path = require('path');
const cors = require('cors');
const {updateStat, getStat, convertDataTo} = require('../3595/utils');
const { log } = require('./utils');

const webServer = express();
const PORT = 8180;
const CORS_OPTIONS = {
  origin: '*',
  headers: 'Content-Type',
  optionsSuccessStatus: 200
}
const LOG_FILE_NAME = path.join(__dirname, '_server.log');

webServer.use(express.json());
webServer.use((req, res, next) => {
  log(LOG_FILE_NAME, '-request-');
  next();
});

webServer.use('/service4095', express.static(path.join(__dirname, 'public/postman/dist/postman')));

webServer.options('/send', (req, res) => {
  log(LOG_FILE_NAME, 'options request');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});
webServer.post('/send', cors(CORS_OPTIONS), async (req, res) => {
  log(LOG_FILE_NAME, 'sending proxy request...');

  try{
    const reqUrl = new URL(req.body.url);
    Object.keys(req.body.queryParams).forEach(key => reqUrl.searchParams.append(key, req.body.queryParams[key]))
    
    const proxy_response = await fetch(reqUrl, {
      method: req.body.method,
      headers: {
        ...req.body.headers,
        'Access-Control-Allow-Origin': '*'
      },
      body: req.body.method ==='POST' ? req.body.data : null,
    });
    
    log(LOG_FILE_NAME, 'recieving proxy response...');
    log(LOG_FILE_NAME, 'sending proxy response...');
    
    res.setHeader("Content-Type", 'application/json');
    
    const proxy_responseHeaders = {}
    for (var pair of proxy_response.headers.entries()) {
      proxy_responseHeaders[pair[0]] = pair[1]
    }
    res.send(JSON.stringify({
      statusOk: proxy_response.ok,
      statusCode: proxy_response.status,
      headers: proxy_responseHeaders,
      body: await proxy_response.text()
    }));
    log(LOG_FILE_NAME, 'proxy response sended');
  } catch(err) {
    res.send(err);
  }
});

// -------------- тестовые запросы ----------------
webServer.post('/vote', cors(CORS_OPTIONS), (req, res) => {
  log(LOG_FILE_NAME, '/vote request...');
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send(`Неверные параметры запроса! 
    Установите: Content-Type: 'application/json',
    Тело запроса должно быть в формате json
    `);
  }
  updateStat(req.body.code).then(() => res.status(200).end())
});
webServer.get('/stat', cors(CORS_OPTIONS), (req, res) => {
  log(LOG_FILE_NAME, '/stat request...');
  let fileType = 'txt';  
  if (req.headers.accept === 'application/xml') {
    res.setHeader("Content-Type", "application/xml");
    fileType = 'xml';
  }
  else if (req.headers.accept === 'text/html') {
    res.setHeader("Content-Type", "text/html");
    fileType = 'html';
  }
  else if (req.headers.accept === 'application/json') {
    res.setHeader("Content-Type", "application/json");
    fileType = 'json';
  }
  else {
    res.setHeader("Content-Type", "text/plain");
  }

  getStat().then((data) => res.send(convertDataTo(data, fileType)));
})
webServer.get('/message', cors(CORS_OPTIONS), (req, res) => {
  log(LOG_FILE_NAME, '/message request...');
  res.send(JSON.stringify({queryParams: {...req.query}}));
});

// -------------- *** ----------------


webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 4095: running on port ${PORT}---`));
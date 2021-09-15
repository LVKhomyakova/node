const express = require('express');
const path = require('path');
const {updateStat, getStat, getVariants, convertDataTo} = require('./utils');

const port = 8180;
const webServer = express();
webServer.use(express.json());

webServer.use('/service3595', express.static(path.join(__dirname, 'public')));

webServer.get('/', (req, res) => {
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

  res.setHeader("Content-Disposition", `attachment; filename=stat.${fileType}`);
  getStat().then((data) => res.send(convertDataTo(data, fileType)));
});

webServer.get('/variants', (req, res) => {
  getVariants().then((data) => res.send(data));
});

webServer.post('/vote', (req, res) => {
  updateStat(req.body.code).then(() => res.status(200).end())
});

webServer.get('/stat', (req, res) => {
  res.setHeader("Cache-Control","public, max-age=0");
  getStat('stat.txt').then((data) => res.send(data));
});

webServer.listen(port, () => console.log("web server 3595: running on port " + port));
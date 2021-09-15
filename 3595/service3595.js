const express = require('express');
const path = require('path');
const {updateStat, getStat, getVariants} = require('./utils');

const port = 8180;
const webServer = express();
webServer.use(express.json());

webServer.use('/service3595', express.static(path.join(__dirname, 'public')));

webServer.get('/service3595', (req, res) => {
  let fileType = '';
  
  if (req.headers.accept === 'application/xml') {
    res.setHeader("Content-Type", "application/xml");
    fileType = 'xml';
    getStat('xml').then((data) => res.send(data));
  }
  else if (req.headers.accept === 'text/html') {
    res.setHeader("Content-Type", "text/html");
    fileType = 'html';
    getStat('html').then((data) => res.send(data));
  }
  else if (req.headers.accept === 'application/json') {
    res.setHeader("Content-Type", "application/json");
    fileType = 'json';
  }

  res.setHeader(`Content-Disposition", 'attachment; filename="stat.${fileType}"`);
  getStat(fileType).then((data) => res.send(data));
});

webServer.get('/variants', (req, res) => {
  getVariants().then((data) => res.send(data));
});

webServer.post('/vote', (req, res) => {
  updateStat(req.body.code).then(() => res.status(200).end())
});

webServer.post('/stat', (req, res) => {
  getStat('txt').then((data) => res.send(data));
});

webServer.listen(port, () => console.log("web server 3595: running on port " + port));
const express = require('express');
const path = require('path');
const {updateStat, getStat, getVariants} = require('./utils');

const port = 8180;
const webServer = express();
webServer.use(express.json());

webServer.use('/service3595', express.static(path.join(__dirname, 'public')));

webServer.use('/service3595', (req, res) => {
  res.setHeader("Content-Disposition", 'attachment; filename="stat.txt"');

  switch(req.headers.accept) {
    case 'application/xml': res.setHeader("Content-Type", "application/xml");
      break;
    case 'text/html': res.setHeader("Content-Type", "text/html");
      break;
    case 'application/json': res.setHeader("Content-Type", "application/json");
      break;
  }
});

webServer.get('/variants', (req, res) => {
  getVariants().then((data) => res.send(data));
});

webServer.post('/vote', (req, res) => {
  updateStat(req.body.code).then(() => res.status(200).end())
});

webServer.post('/stat', (req, res) => {
  getStat().then((data) => res.send(data));
});

webServer.listen(port, () => console.log("web server 3595: running on port " + port));
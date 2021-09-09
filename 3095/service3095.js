const express = require('express');
const path = require('path');

const {updateStat, getStat, getVariants} = require('./utils');


const port = 8180;
const webServer = express();
webServer.use(express.json());

webServer.use('/service3095', express.static(path.join(__dirname, 'public')));

webServer.get('/variants', (req, res) => {
  getVariants().then((data) => res.send(data));
});

webServer.post('/vote', (req, res) => {
  updateStat(req.body.code).then(() => res.status(200).end())
});

webServer.post('/stat', (req, res) => {
  getStat().then((data) => res.send(data));
});

webServer.listen(port, () => console.log("web server 3095: running on port " + port));
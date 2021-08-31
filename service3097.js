const express = require('express');

const webServer = express();

const port = 8180;

webServer.get('/service3097', (req, res) => {
  console.log(`service3097 called, req.originalUrl=${req.originalUrl}`);

  if (!req.query.login || !req.query.password)
    res.status(400).sendFile(__dirname + "/index.html");
  else 
    res.status(200).send(`Login: ${req.query.login}, Password: ${req.query.password}`);
});

webServer.listen(port, ()=> console.log("web server running on port " + port));
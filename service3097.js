const express = require('express');

const webServer = express();

const port = 8180;

webServer.get('service3097', (req, res) => {
  console.log(`service3097 called, req.originalUrl=${req.originalUrl}`);
  console.log(`QueryParams=${req.query.login}, ${req.query.password}`);

  res.send("service3097 ok!");
});

webServer.listen(port, ()=> console.log("web server running on port " + port));
const express = require('express');
const { query, validationResult } = require('express-validator');

const webServer = express();
const port = 8180;

webServer.use(express.static(__dirname));

webServer.get('/service3097',
  query('login').notEmpty(),
  query('password').notEmpty().isLength({min: 4}),
 (req, res) => {
  console.log(`* service3097 called, req.originalUrl=${req.originalUrl}`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {    
    console.log("Validation error!!");
    res.status(400).send(  
      `<form method="GET" action="http://178.172.195.18:8180/service3097">
      <label for="">Login</label>
      <input type="text" name="login" value="${req.query.login || ''}">  
      <label for="">Password</label>
      <input type="password" name="password" value="${req.query.password || ''}">  
      <input type="submit" value="SEND">
      </form>
      <p for="" style="color:red">Validation error!!</p>
      `
    );
  }
  else {
    console.log(`Login: ${req.query.login}, Password: ${req.query.password}`);
    res.status(200).send(`<p style="color:green">Login: ${req.query.login}, Password: ${req.query.password}</p>`);
  }
});

webServer.listen(port, ()=> console.log("web server running on port " + port));
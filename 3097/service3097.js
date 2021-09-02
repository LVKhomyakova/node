const express = require('express');
const { query, validationResult } = require('express-validator');

const webServer = express();
const port = 8180;
const errorMsg = '<p for="" style="color:red">Validation error!!</p>';

const initForm = (login, password) => {
 return `<form method="GET" action="http://178.172.195.18:8180/service3097">
 <label for="">Login</label>
 <input type="text" name="login" value="${login || ''}">  
 <label for="">Password</label>
 <input type="password" name="password" value="${password || ''}">  
 <input type="submit" value="SEND">
 </form>`
};

webServer.use((req, res, next) => {
  console.log(`* service3097 called, req.originalUrl=${req.originalUrl}`);
  next();
});

webServer.get('/service3097',
  query('login').optional().notEmpty(),
  query('password').optional().notEmpty().isLength({min: 4}),
 (req, res) => {
  const errors = validationResult(req);
  console.log(query.isEmpty)
  console.log(errors)
  if (!errors.isEmpty()) {    
    res.status(400).send(initForm(req.query.login, req.query.password) + errorMsg);
  }
  else {
    if(!req.query.login || !req.query.password)
      res.status(200).send(initForm());
    else 
      res.status(200).send(`<p style="color:green">Login: ${req.query.login}, Password: ${req.query.password}</p>`);
  }
});

webServer.listen(port, ()=> console.log("web server running on port " + port));
const express = require('express');
const path = require('path');
const { validationResult, body } = require('express-validator');
const multer = require('multer'); 


const webServer = express();
const port = 8180;
const errorMsg = '<p for="" style="color:red">Validation error!!</p>';

const drawForm = (login, password) => {
  return `<form method="POST" action="/service4097"  enctype='multipart/form-data'>
  <label for="">Login</label>
  <input type="text" name="login" value="${login || ''}">  
  <label for="">Password</label>
  <input type="password" name="password" value="${password || ''}">  
  <input type="submit" value="SEND">
  </form>
  <p style="color:green">${login || ''} ${password || ''}</p>`
};

const upload = multer( { dest: path.join(__dirname,"uploads") } ); 

webServer.use(express.urlencoded({extended:true}));

webServer.use((req, res, next) => {
  console.log(`* service4097 called, req.originalUrl=${req.originalUrl}`);
  next();
});

webServer.get('/service4097', (req, res) => {
  // res.status(200).send(drawForm(res.app.get('data')?.login, res.app.get('data')?.password));
  res.status(200).send(drawForm(req.query?.login, req.query?.password));
});

webServer.post('/service4097', 
upload.none(),
body('login').optional().notEmpty(),
body('password').optional().notEmpty().isLength({min: 4}),
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())  {
    res.status(400).send(drawForm(req.body.login, req.body.password) + errorMsg);
  } else {
    // res.app.set('data', req.body); 
    const url = new URL('/service4097', req.protocol + '://' + req.headers.host);
    Object.keys(req.body).forEach((key) => url.searchParams.append(key, req.body[key]));
    res.redirect(302, url);
  }
});

webServer.listen(port, ()=> console.log("web server running on port " + port));
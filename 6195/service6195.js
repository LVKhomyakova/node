const express = require('express');
const path  = require('path');
const cors = require('cors');
const { log } = require('./utils');
var mysql = require('mysql');


const LOG_FILE_NAME = path.join(__dirname, '_server.log');
const webServer = express();
const PORT = 8180;
const CORS_OPTIONS = {
  origin: '*',
  headers: 'Content-Type',
  optionsSuccessStatus: 200
}

const CONNECTION_STRING = {
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'khom'
}

webServer.use(express.json());
webServer.use((req, res, next) => {
  log(LOG_FILE_NAME, '-request-');
  next();
});
webServer.use('/service6195', express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------ options
webServer.options('/sql', (req, res) => {
  log(LOG_FILE_NAME, 'options request');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.send('');
});
// ------------------------------------------------------ post
// ------------------------------------------------------ get
webServer.post('/sql', cors(CORS_OPTIONS), (req, res) => {
  log(LOG_FILE_NAME, 'выполнение запроса к базе...');
  res.setHeader("Content-Type", "application/json");

  const connection = mysql.createConnection(CONNECTION_STRING);  
  connection.connect();
  connection.query(req.body.query, (error, results, fields) => {
    const responseObj = error 
    ? {results: JSON.stringify({error: error.sqlMessage})} 
    : {results: Array.isArray(results) ? results : JSON.stringify(results), fields: fields?.map((item) => item.name)}
    res.status(200).send( JSON.stringify(responseObj));
  });
  connection.end();
});

webServer.listen(PORT, () => log(LOG_FILE_NAME, `---web server 6195: running on port ${PORT}---`))
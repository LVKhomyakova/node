const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const {updateStat, getStat, getVariants, convertDataTo} = require('./utils');

const port = 8180;
const webServer = express();

webServer.set('view engine', 'handlebars');
webServer.set('views', path.join(__dirname, 'views'));

webServer.use(express.json());
webServer.use('/service3595a', express.static(path.join(__dirname, 'public')));

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
  getVariants().then((data) => {
    try {
      const dataObj = JSON.parse(data);
      const variants = [];
      Object.keys(dataObj).forEach((key) => {
        variants.push({code: key, answer: dataObj[key]})
      });      
      res.render("variants.hbs", {isError: false, data: variants});
    } catch(error) {
      res.render("variants.hbs", {isError: true, message: error});
    }
  });
});

webServer.post('/vote', (req, res) => {
  updateStat(req.body.code).then(() => res.status(200).end())
});

webServer.get('/stat', (req, res) => {
  res.setHeader("Cache-Control","public, max-age=0");
  getStat('stat.txt').then((stat) => {
    const statObj = JSON.parse(stat);
    const statArray = [];
    const totalCount = statObj.reduce((sum, curItem) => sum + curItem, 0);
    statObj.forEach((value, i) => statArray.push({code: i+1, percent: (value / totalCount) * 100}));
    res.render('stat.hbs', {data: statArray});
  }
  );
});

webServer.listen(port, () => console.log("web server 3595a: running on port " + port));
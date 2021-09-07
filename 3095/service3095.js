const express = require('express');
const path = require('path');

 const {updateStat, getStat} = require('./utils');

const port = 8180;
const webServer = express();

webServer.use(express.static(__dirname + '/public'));

webServer.get('/service3095', (req, res) => {
  res.status(200).send('ok');
});

webServer.get('/variants', (req, res) => {
  res.send(`  
    <p>Варинаты ответов</p>
    <ul>
      <li>1 - Три дня ничего не ели</li>
      <li>2 - Убивали мамонта</li>
      <li>3 - Танцевали вокруг костра с бубном в руках</li>
      <li>4 - Ходили с зонтиком и говорили «кажется, дождь начинается…»</li>
    </ul>
  `)
});

webServer.get('/vote', (req, res) => {
  const code = 2;
  updateStat(code);
  res.send(`

  `);
});

webServer.get('/stat', (req, res) => {
  res.send(getStat())
});

webServer.listen(port, () => console.log("web server 3095: running on port " + port));
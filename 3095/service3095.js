const express = require('express');
const path = require('path');

const {updateStat, getStat} = require('./utils');


const port = 8180;
const webServer = express();

webServer.use('/service3095', express.static(path.join(__dirname, 'public')));

webServer.get('/variants', (req, res) => {
  res.send(`  
    <ul>
      <li>1 - Три дня ничего не ели</li>
      <li>2 - Убивали мамонта</li>
      <li>3 - Танцевали вокруг костра с бубном в руках</li>
      <li>4 - Ходили с зонтиком и говорили «кажется, дождь начинается…»</li>
    </ul>
  `)
});

webServer.get('/vote', (req, res) => {
  updateStat(req.query.code).then(() => res.status(200).end())
});

webServer.post('/stat', (req, res) => {
  getStat().then((data) => res.send(data));
});

webServer.listen(port, () => console.log("web server 3095: running on port " + port));
const fs = require('fs').promises;
const path = require('path');

const statFileName = path.join(__dirname, 'stat.txt'); 
const defaultStat = {1:0, 2:0, 3:0, 4:0};

function updateStat(code) {
  return fs.readFile(statFileName,  "utf8")
  .then((data) => {
    console.log(data)
    const statData = JSON.parse(data.toString() || defaultStat);
    statData += 1;
    return statData;
  })
  .then((statData) => fs.writeFile(statFileName, JSON.stringify(statData)))
  .catch((err) => console.log(err.message));
}

function getStat() {
  return fs.readFile(statFileName).then((data) => data.toJSON());
}

module.exports={
  updateStat,
  getStat
};
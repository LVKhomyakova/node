const fsp = require('fs').promises;
const path = require('path');

const statFileName = path.join(__dirname, 'stat.txt'); 
const defaultStat = [0, 0, 0, 0];

function updateStat(code) {
  return fsp.readFile(statFileName, {encoding: 'utf-8'})
  .then((data) => {
    const statData = JSON.parse(data || JSON.stringify(defaultStat));
    ++statData[code - 1];
    return statData;
  })
  .then((statData) => fsp.writeFile(statFileName, JSON.stringify(statData)))
  .catch((err) => console.log(err.message));
}

function getStat() {
  return fsp.readFile(statFileName, {encoding: 'utf-8'}).then((data) => data);
}

module.exports={
  updateStat,
  getStat
};
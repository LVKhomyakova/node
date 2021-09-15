const fsp = require('fs').promises;
const path = require('path');

const statFileName = path.join(__dirname, 'DB/stat.txt'); 
const variantsFileName = path.join(__dirname, 'DB/variants.txt'); 
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

function getStat(type) {
  return fsp.readFile(path.join(__dirname, `DB/stat.${type}`), {encoding: 'utf-8'}).then((data) => data);
}

function getVariants() {
  return fsp.readFile(variantsFileName, {encoding: 'utf-8'}).then((data) => data);
}

module.exports={
  updateStat,
  getStat,
  getVariants
};
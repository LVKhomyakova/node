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

function getStat() {
  return fsp.readFile(statFileName, {encoding: 'utf-8'}).then((data) => data);
}

function getVariants() {
  return fsp.readFile(variantsFileName, {encoding: 'utf-8'}).then((data) => data);
}

// ------------------------------------------------------------------------------
function convertToHTML(statString) {
  const statObj = JSON.parse(statString);
  const totalCount = statObj.reduce((sum, curItem) => sum + curItem, 0);
  const statInPercent = statObj.map((value) => (value / totalCount) * 100);

  let htmlString = `
  <div id="stat">
    <div class="answers_wrapper">`;
  statInPercent.forEach((value, index) => {
    htmlString += `
      <div class="answer">
        <div>${index + 1}</div>
        <div class="progress" style="width: ${value};"></div>
      </div>`;
  });
  htmlString += `
    </div>
  </div>`;

  return htmlString;
}

function convertToXML(statString) {
  const statObj = JSON.parse(statString);
  const totalCount = statObj.reduce((sum, curItem) => sum + curItem, 0);
  const statInPercent = statObj.map((value) => (value / totalCount) * 100);

  let xmlString = `
  <stat>`;
  statInPercent.forEach((value, index) => {
    xmlString += `
      <answer>
        <code>${index + 1}</code>
        <percent>${value}</percent>
      </answer>`;
  });
  xmlString += `
  </stat>`;

  return xmlString;
}

function convertToJSON(statString) {
  const statObj = JSON.parse(statString);
  const totalCount = statObj.reduce((sum, curItem) => sum + curItem, 0);
  const statInPercent = statObj.map((value) => (value / totalCount) * 100);

  const array = [];
  statInPercent.forEach((value, index) => {
    array.push({
      code: index + 1,
      percent: value
    });
  });
  return JSON.stringify(array);
}

function convertDataTo(statString, fileType) {
  switch(fileType) {
    case "html": return convertToHTML(statString);
    case "xml": return convertToXML(statString);
    case "json": return convertToJSON(statString);
    default: return statString;
  }
}


module.exports={
  updateStat,
  getStat,
  getVariants,
  convertDataTo
};

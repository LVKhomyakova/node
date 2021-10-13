const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');
const os = require('os');

function log(filePath, message) {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    const logLine = `${time} : ${message}`;
    console.log(logLine);

    fsp.appendFile(filePath, logLine + os.EOL)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

// -------------------------------------------
function getFilesList() {
  return fsp.readdir(path.join(__dirname,'DB'))
    .then((filesList) => {
      const filesData = [];
      filesList.forEach(async (fileName) => {
        let comment = '';
        if (path.extname(fileName) !== '.comment') {
          if (filesList.includes(fileName + '.comment'))
            comment = await fsp.readFile(path.join(__dirname, 'DB', fileName + '.comment'), {encoding: 'utf-8'});
          else
            comment = '';
          filesData.push({fileName: fileName.split('.comment')[0], comment})
        }
      });      
      return {isError: false, filesData}
    })
    .catch((error) => ({isError: true, message: error}));
}

function writeCommentFile(fileName, comment) {
  fsp.writeFile(fileName, JSON.stringify(comment))
}

function getFile(fileName) {
  return fs.createReadStream(path.join(__dirname, 'DB', fileName));
}

module.exports = {
  log,
  getFilesList,
  getFile,
  writeCommentFile
};
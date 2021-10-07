const fsp = require('fs').promises;
const os = require('os');

export function log(filePath, message) {
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

// module.exports = {
//   log,
// };
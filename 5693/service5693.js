const readline = require('readline');
const zlib = require('zlib');
const util = require('util');
const pathLib = require('path');
const { pipeline } = require('stream');
const fs = require('fs');
const { stat, readdir } = require('fs').promises;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Укажите путь к папке: `, async (path) => {
  // path = '/home/user/khomyakova/node/5693/public';
  console.log(`Архивация завершена! Создано ${await compress(path)} архива`);
  rl.close();       
});

async function compress(path) { 
  let count = 0; 
  try {
    console.log(`Сканируется папка    ${path}...`);
    const files = await readdir(path);

    for(const file of files) {
      const fullPath = pathLib.join(path, file);
      const fileStat = await stat(fullPath);           
   
      if (fileStat.isDirectory()) {
        count += await compress(fullPath); 
      } else if (pathLib.extname(file) !== '.gz') { 
    
        if (!files.includes(file + '.gz')) {
          console.log(`Создание архива файла: ${fullPath}..`);
        } else if (fileStat.mtimeMs > (await stat(fullPath + '.gz')).mtimeMs){
          console.log(`Обновление архива файла: ${fullPath}..`);
        } else {
          continue; 
        }
         
        const source = fs.createReadStream(fullPath);
        const gZip = zlib.createGzip();
        const destination = fs.createWriteStream(fullPath +'.gz');
        pipeline(source, gZip, destination, (err) => {
          if (err) {
            console.error('Ошибка архивации: ', err);
            process.exitCode = 1;
          }
        });
        console.log(`Завершена aрхивация файла: ${fullPath} `);
        count++;
      } 
    }  
  } catch (err) {
    console.error(`Ошибка сканирования папки ${path}: `, err);
  }  
  return count;
}

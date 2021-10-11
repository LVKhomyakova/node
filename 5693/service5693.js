const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Укажите путь к папке: `, path => {
    
  console.log(`Путь: ${path}`);
  rl.close();        
});
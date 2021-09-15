const API = 'http://178.172.195.18:8180';

const mimeTypes = {
  xml: 'application/xml',
  html: 'text/html',
  json: 'application/json',
};

// --------------------- запросы к API -------------------------
async function getVariants() {
  const response = await fetch(API + '/variants');
  if (response.ok)
    return response.json();
  else
    return "Ошибка запроса";
}

async function getStat() {
  const response = await fetch(API + '/stat');
  if(response.ok)     
   return response.json();
  else
    return "Ошибка запроса";
}

async function vote(code) {
  const response = await fetch(API + `/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({code})
  });
  if (response.ok)
    return "ok";
  else
    return "Ошибка запроса";
}

async function load(type) {
  const response = await fetch(API + `/`, {
    headers: {
      'Accept': mimeTypes[type]
    },
  });
  if(response.ok)     
   return response.text();
  else
    return "Ошибка запроса";
}
// --------------------------- RENDER ------------------------------
function sowStatFile(response) {
  document.querySelector('textarea').value = response;
}

function drawStat(stat) {
  if (typeof(stat) === 'string') {
    document.getElementById('stat').innerText = stat;
    return;
  }

  const totalCount = stat.reduce((sum, curItem) => sum + curItem, 0);
  const statInPercent = stat.map((value) => (value / totalCount) * 100);

  const answerWrapper = document.createElement('div');
  answerWrapper.className = "answers_wrapper";

  statInPercent.forEach((value, index) => {
    const answer = document.createElement('div');
    answer.className = 'answer';
    
    const label = document.createElement('div');
    label.textContent = index + 1;
    
    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.style.width = `${value}%`;
    
    answer.append(label);
    answer.append(progress);
    answerWrapper.append(answer);
  });

  document.getElementById('stat').firstChild?.remove();
  document.getElementById('stat').append(answerWrapper);
}

function drawVariants(data) {
  if (typeof(data) === 'string') {
    document.getElementById('variants').innerText = data;
    return;
  }
  
  const listEl = document.createElement('ul');
  Object.keys(data).forEach((item, index ) => {
    const liEl = document.createElement('li');
    liEl.textContent = `${index + 1} - ${data[item]}`;
    
    listEl.append(liEl);
  })

  document.getElementById('variants').append(listEl);
}

// --------------------------- *** ------------------------------
async function loadStatFile(type) {
  sowStatFile(await load(type));
}

async function sendAnswer(code) {
  const response = await vote(code);
  if (response === 'ok')
    drawStat(await getStat());
  else
    document.getElementById('stat').innerHTML = response;
}

async function initPage() {
  drawVariants(await getVariants());
  drawStat(await getStat());
}

initPage();

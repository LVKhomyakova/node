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
    return response.text();
  else
    return "Ошибка запроса";
}

async function getStat() {
  const response = await fetch(API + '/stat');
  if(response.ok)     
   return response.text();
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
function showStatFile(response) {
  document.querySelector('textarea').value = response;
}

function drawStat(stat) {
  console.log(stat)
  document.getElementById('stat').firstChild?.remove();
  document.getElementById('stat').insertAdjacentHTML('afterbegin', stat);
}

function drawVariants(data) {
  document.getElementById('variants').insertAdjacentHTML('afterbegin', data);
}

// --------------------------- *** ------------------------------
async function loadStatFile(type) {
  showStatFile(await load(type));
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

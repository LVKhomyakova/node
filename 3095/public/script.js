const API = 'http://178.172.195.18:8180';

// --------------------- запросы к API -------------------------
async function getVariants() {
  const response = await fetch(API + '/variants');
  if (response.ok)
    return response.text();
  else
    return "Ошибка запроса";
}

async function getStat() {
  const response = await fetch(API + '/stat', {method: 'POST'} );
  if(response.ok)     
   return response.text();
  else
    return "Ошибка запроса";
}

async function vote(code) {
  const response = await fetch(API + `/vote?code=${code}`);
  if (response.ok)
    return "ok";
  else
    return "Ошибка запроса";
}
// --------------------------- *** ------------------------------

async function sendAnswer(code) {
  const response = await vote(code);
  if (response === 'ok')
    document.getElementById('stat').innerHTML = await getStat();
  else
    document.getElementById('stat').innerHTML = response;
}

async function initPage() {
  document.getElementById('answers').innerHTML = await getVariants();
  document.getElementById('stat').innerHTML = await getStat();
}

initPage();

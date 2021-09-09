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

function drawStat(statString) {
  const stat = JSON.parse(statString);
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
    console.log(answer)
  });

  document.getElementById('stat').firstChild?.remove();
  document.getElementById('stat').append(answerWrapper);
}
// --------------------------- *** ------------------------------

async function sendAnswer(code) {
  const response = await vote(code);
  if (response === 'ok')
    drawStat(await getStat());
  else
    document.getElementById('stat').innerHTML = response;
}

async function initPage() {
  document.getElementById('answers').innerHTML = await getVariants();
  drawStat(await getStat());
}

initPage();

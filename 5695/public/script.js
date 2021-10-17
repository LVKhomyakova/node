const API = 'http://178.172.195.18:8180';
const API_WS = 'ws://178.172.195.18:8181';

// --------------------- запросы к API -------------------------
async function loadFilesList() {
  const response = await fetch(API + `/`, {
    headers: {
      'Accept': 'text/plain'
    },
  });
  if(response.ok)     
   return response.text();
  else
    return "Ошибка запроса";
}

async function getFile(fileName) {
  const response = await fetch(API + `/download?filename=${fileName}`, {
    headers: {
      'Accept': 'application/octet-stream'
    },
  });
  if(response.ok)     
   return response.text();
  else
    return "Ошибка запроса";
}

async function putFile(data, connectionId) {
  const response = await fetch(API + `/upload`, {
    method: 'POST',
    headers: {connectionid: connectionId},
    body: data
  });
  if(response.ok)     
   return response.text();
  else
    return "Ошибка запроса";
}
// --------------------------- RENDER ------------------------------
function drawFilesList(data) {
  const list =  document.getElementById('list');
  list.innerHTML = '';
  list.insertAdjacentHTML('afterbegin', data);
}

function showProgress(progress) {
  document.getElementById('progress').innerText = progress + '%';
}

// --------------------------- *** ------------------------------
async function upload() {  
  const connectionId = Math.floor(Math.random() * 1000000);
  const file = document.getElementById('upload').files[0];
  const comment = document.getElementById('comment').value;
  const data = new FormData();
  data.append("file", file);
  data.append("comment", comment);
  
  let connection = new WebSocket(API_WS); 
  connection.onopen = () => connection.send(JSON.stringify({connectionId}))
  connection.onmessage = (event) => showProgress(event.data)
  connection.onerror = (error) => console.log('WebSocket error:', error);
  connection.onclose = () => {
    connection = null;
    clearInterval(keepAliveTimer);
  };
  let keepAliveTimer = setInterval(() => {
    connection.send('KEEP_ALIVE'); 
  }, 5000); 
  
  try {
    const res = await putFile(data, connectionId);
    console.log('file is uploaded')
    drawFilesList(await loadFilesList());  
  } catch(err) {
    showProgress(" Связь с ервером потеряна! Повторите попытку позже");
    console.log(err);    
  }
}

async function download(fileName) {
  const res = await getFile(fileName);
}

async function initPage() {
  drawFilesList(await loadFilesList());
}

initPage();

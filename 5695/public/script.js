const API = 'http://178.172.195.18:8180';

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

async function putFile(data) {
  const response = await fetch(API + `/upload`, {
    method: 'POST',
    body: data
  });
  if(response.ok)     
   return response.text();
  else
    return "Ошибка запроса";
}
// --------------------------- RENDER ------------------------------

function drawFilesList(data) {
  console.log(data)
  document.body.insertAdjacentHTML('beforeend', data);
}

// --------------------------- *** ------------------------------
async function upload() {
  const file = document.getElementById('upload').files[0];
  const comment = document.getElementById('comment').value;
  const data = new FormData();
  data.append("file", file);
  data.append("comment", comment);
  const res = await putFile(data);
  console.log('file is uploaded')
}

async function download(fileName) {
  const res = await getFile(fileName);
}

async function initPage() {
  drawFilesList(await loadFilesList());
}

initPage();

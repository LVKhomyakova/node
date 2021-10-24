const API = 'http://178.172.195.18:8180';
const API_WS = 'ws://178.172.195.18:8181';

// --------------------- запросы к API -------------------------
async function getQueryResults(query) {
  const response = await fetch(API + `/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query})
  });
  if(response.ok)     
   return response.json();
  else
    return "Ошибка запроса";
}
// --------------------------- RENDER ------------------------------
function showResults(data) {
  const tableEl =  document.getElementById('results');
  tableEl.innerHTML = '';
  let resultArray = [];
  if (Array.isArray(data.results))
    resultArray = data.results;
  else
    resultArray = [JSON.parse(data.results)];  

  // headers
  const headers = Array.isArray(data.results) ? data.fields : Object.keys(JSON.parse(data.results));
  const headersRowEl = document.createElement('tr');
  headers.forEach((header) => {
    const headerCol = document.createElement('th');
    headerCol.textContent = header;
    headersRowEl.append(headerCol);
  });
  tableEl.append(headersRowEl);
  //rows
  resultArray.forEach((rowData) => {
    const rowEl = document.createElement('tr');
    Object.keys(rowData).forEach((colData) => {
      const colEl = document.createElement('td');
      colEl.textContent = rowData[colData];
      rowEl.append(colEl);
    });      
    tableEl.append(rowEl);
  });      
}

// --------------------------- *** ------------------------------
async function runSQL() {
  const query = document.getElementById('sql').value;
  showResults(await getQueryResults(query));
}

async function testSQL(query) {
  clearAll();
  document.getElementById('sql').value = query;
}

function clearAll() {
  document.getElementById('sql').value = '';
  document.getElementById('results').innerHTML = '';
}

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
  // headers
  const headers = data.fields || ['message'];
  const headersRowEl = document.createElement('tr');
  headers.forEach((header) => {
    const headerCol = document.createElement('th');
    headerCol.textContent = header;
    headersRowEl.append(headerCol);
  });
  tableEl.append(headersRowEl);
  //rows
  if(data.error) {
    const rowEl = document.createElement('tr');
    const colEl = document.createElement('td');
    colEl.textContent = data.error;
    rowEl.append(colEl);
    tableEl.append(rowEl);
  } else if(Array.isArray(data.results)) {
    data.results.forEach((rowData) => {
      const rowEl = document.createElement('tr');
      Object.keys(rowData).forEach((colData) => {
        const colEl = document.createElement('td');
        colEl.textContent = rowData[colData];
        rowEl.append(colEl);
      });      
      tableEl.append(rowEl);
    });    
  } else {
    const rowEl = document.createElement('tr');
    const colEl = document.createElement('td');
    colEl.textContent = data.results;
    rowEl.append(colEl);
    tableEl.append(rowEl);
  }
}

// --------------------------- *** ------------------------------
async function runSQL() {
  const query = document.getElementById('sql').value;
  // const query = "selec * from customers";
  // const query = "update * from customers";
  // const query = "select * from customers";

  showResults(await getQueryResults(query));
}

async function testSQL(query) {
  document.getElementById('sql').value = query;
  showResults(await getQueryResults(query));
}

function clearAll() {
  console.log('query')

  document.getElementById('sql').value = '';
  document.getElementById('results').innerHTML = '';
}

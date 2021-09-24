const API = 'http://178.172.195.18:8180';

function createRequest(requestForm) {
    const method = requestForm.elements.method.value;
    const url = requestForm.elements.url.value;

    Object.keys(requestForm.elements).forEach((key) => {
      if (key.includes('hk')) {
        
      }
      

    });

    const headers = {};
    const body = requestForm.elements.body.value;

    send(method, url, headers, body)
        .then((response) => showResponse(response))
        .catch((err) => showResponse(err));
}

async function send(method, url, headers, body) {

    const response = await fetch(API + '/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({data: body, method, url, headers})
    });

    if(response.ok)     
     return response.json();
    else
      return "Ошибка запроса";
}

function showResponse(response) {

  console.log(response)
    document.getElementById('response').value = JSON.stringify(response.data);
}
  
  
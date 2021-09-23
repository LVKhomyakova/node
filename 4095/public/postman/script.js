function createRequest(requestForm) {
    console.log(requestForm);
    
    const method = requestForm.elements.method.value;
    // const url = requestForm.method;
    const url = 'http://217.21.60.255:5000/192.168.13.118:5000/json/reply/GetAllAgeGroups';
    
    const headers = {}
    
    const body = requestForm.elements.body.value;
    console.log(body);

    send(method, url, headers, body)
        .then((response) => showResponse(response))
        .catch((err) => showResponse(err));
}

async function send(method, url, headers, body) {
    const response = await fetch(url, {
      method: method,
      headers: {...headers},
      body: body
    });

    if(response.ok)     
     return response.text();
    else
      return "Ошибка запроса";
}

function showResponse(response) {
    document.getElementById('response').value = response;
}
  
  
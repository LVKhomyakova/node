const assert = require('assert').strict;

const PATTERN_URL = /^(http|https):\/\/[^ "]+$/;
const METHODS = ['GET', 'POST'];

export const ERROR_LIST = {
    method: {
        wrongName: 'Неверный метод',
        required: 'Не указан метод запроса',
    },
    url: {
        pattern: 'Неверный формат URL ( http(s)://domen/path?query )',
        required: 'Не указан url запроса',
    },
    dataBody: {
        required: 'Пустое тело запроса',
        format: 'Тело запроса должно быть в формате JSON'
    },
    headers: 'В запросе должен быть минимум 1 заголовок',
}

export function assertValidate(requestData) {
    assert.ok(requestData.method, ERROR_LIST.method.required);
    assert.ok(METHODS.includes(requestData.method), ERROR_LIST.method.wrongName);
    
    assert.ok(requestData.url, ERROR_LIST.url.required);
    assert.match(requestData.url, PATTERN_URL, ERROR_LIST.url.pattern);
    
    if (requestData.method === 'POST') {
        assert.ok(requestData.data, ERROR_LIST.dataBody.required);
        assert.doesNotThrow(() => JSON.parse(requestData.data), ERROR_LIST.dataBody.format);
    }
    
    assert.notDeepStrictEqual(requestData.headers, {}, ERROR_LIST.headers);
}


export function validate(requestData) {    
    const errors = [];
    if (!requestData.method) 
        errors.push({error: ERROR_LIST.method.required});
    else if (!METHODS.includes(requestData.method))
        errors.push({error: ERROR_LIST.method.wrongName});

    if (!requestData.url) 
        errors.push({error: ERROR_LIST.url.required});
    else if (!requestData.url.match(PATTERN_URL))
        errors.push({error: ERROR_LIST.url.pattern});

    if (requestData.method === 'POST') {
        if (!requestData.data)
            errors.push({error: ERROR_LIST.dataBody.required});
        else {
            try{
                JSON.parse(requestData.data);
            } catch(_){
                errors.push({error: ERROR_LIST.dataBody.format});
            }
        }
    }

    if (!Object.keys(requestData.headers).reducer((count) => count ? count++ : count, 0))
        errors.push({error: 'headers', error: ERROR_LIST.headers});
    
    return errors;
}

// module.exports = {
//     assertValidate,
//     validate,
//     ERROR_LIST
// };
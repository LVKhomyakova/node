const fetch = require('isomorphic-fetch');

import { ERROR_LIST, validate } from './validation';

describe('validation tests', () => {
  // method
    it('empty method', () => {
        const errors = validate({
          method: '', 
          url: 'http://178.172.195.18:8180/stat', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: {}
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.method.required);
    });
    it('wrong method', () => {
        const errors = validate({
          method: 'GETT', 
          url: 'http://178.172.195.18:8180/stat', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: {}
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.method.wrongName);
    });
  // url
    it('empty url', () => {
        const errors = validate({
          method: 'GET', 
          url: '', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: {}
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.url.required);
    });
    it('wrong url', () => {
        const errors = validate({
          method: 'GET', 
          url: '/178.172.195.18:8180/stat', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: {}
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.url.pattern);
    });
  // body
    it('empty body', () => {
        const errors = validate({
          method: 'GET', 
          url: '', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: {}
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.dataBody.required);
    });
    it('body is not json', () => {
        const errors = validate({
          method: 'GET', 
          url: '/178.172.195.18:8180/stat', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: 'string'
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.dataBody.format);
    });
  // headers
    it('not enough headers', () => {
        const errors = validate({
          method: 'GET', 
          url: 'http://178.172.195.18:8180/stat', 
          queryParams: {}, 
          headers: {}, 
          data: {}
        });
        expect(errors.length).toBe(1);
        expect(errors[0].error).toBe(ERROR_LIST.headers);
    });
  // correct
    it('correct requestData', () =>  {
        const errors = validate({
          method: 'GET', 
          url: 'http://178.172.195.18:8180/stat', 
          queryParams: {}, 
          headers: {'Content-type': 'application/json'}, 
          data: {}
        });
        expect(errors.length).toBe(0);
    });
});

// async tests
const API = 'http://178.172.195.18:8180';
describe('api tests', function() {

  it('correct requestData', async (done) => {

      const response = await fetch(`${API}/send`, {
        method: 'GET', 
        url: 'http://178.172.195.18:8180/stat', 
        queryParams: {}, 
        headers: {}, 
        data: {}
      });
      expect(response.status).toBe(200);
      done();  
  });

  it('wrong requestData', async (done) => {

    const response = await fetch(`${API}/send`, {
      method: 'GET', 
      url: '//178.172.195.18:8180/stat', 
      queryParams: {}, 
      headers: {}, 
      data: {}
    });
    expect(response.status).toBe(400);
    done();
  });
});
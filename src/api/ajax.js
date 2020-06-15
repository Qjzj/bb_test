/**
 * @Author QJ
 * @date 2020--12 11:45
 * @desc ajax.js
 */
import axios from 'axios';
import {Message} from 'element-ui';
import {getCookie, setCookie} from "../utils/index.js";

export const BASE_URL = '/egg';

const RESPONSE = {
  code: 'error_code',
  message: 'message',
  data: 'data'
};

export default function ajax(url, data = {}, method="GET") {

  return new Promise((resolve) => {
    let promise;

    if(method.toUpperCase() === 'GET') {

      let paramsStr = '';
      for(const key in data) {
        if(Object.prototype.hasOwnProperty.call(data, key)) {
          paramsStr += key + '=' + data[key] + '&'
        }
      }

      if(paramsStr) {
        paramsStr = paramsStr.slice(0, paramsStr.lastIndexOf('&'));

        url += '?' + paramsStr;
      }

      console.log(url);
      promise = axios.get(url);
    }else if(method.toUpperCase() === 'POST') {
      promise = axios.post(url, data);
    }else if(method.toUpperCase() === 'PUT') {
      promise = axios.put(url, data);
    }else if(method.toUpperCase() === 'DELETE') {
      promise = axios.delete(url)
    }

    promise.then(response => {
      const {data, status} = response;
      if(status === 200) {

        resolve(data);
      }else {
        Message.error('请求出错');
      }

    }).catch(e => {
      Message.error('请求出错');
      console.log('请求出错', e);
    })

  })

}

axios.interceptors.request.use(config => {
  const token = getCookie('token')
  if(token) {
    // 刷新token 的过期时间
    setCookie('token', token);
    config.headers['X-Token'] = token;
  }
  return config;
}, error => {
    console.log('request', error);
    return Promise.reject(error);
});


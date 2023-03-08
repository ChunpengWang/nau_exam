import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import { getToken, clearAllData } from '@/utils/auth';

/* eslint-disable */
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.NODE_ENV === 'development' ? '/api' :'', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000000 // request timeout
});

// let testToken = 'OGMyZWRkMzItNGI2ZC00OTc3LTg3NGMtZDlmN2JhZTM5OTY5';
service.interceptors.request.use(
  config => {
    if (config.method.toLowerCase() === 'get') {
      config.params = config.params
        ? { ...config.params, token: getToken() }
        : { token: getToken() };
    } else if (config.method.toLowerCase() === 'post') {
      if (config.data instanceof FormData) {
        config.data.append('token', getToken());
      } else {
        config.data = config.data
          ? config.data + `&token=${getToken()}`
          : `token=${getToken()}`;
      }
    }
    config.headers.token = getToken()
    return config;
  },
  error => {
    console.error('请求拦截器', error);
    Promise.reject(error);
  }
);

/**
 * 通用axios响应拦截
 */

function download(resp, name) {
  const url = URL.createObjectURL(resp.data),
    link = document.createElement('a');

  try {
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  } finally {
    document.removeChild(link);
  }
}

service.interceptors.response.use(
  response => {
    const resp = response.data;
    if(resp.state == 0){
      Message({
        message: resp.msg,
        type: 'error',
        duration: 2 * 1000,
        showClose: true
      });
      return Promise.reject(resp);
    }else if(resp.state == 403){
      MessageBox.confirm(resp.msg, '登录过期', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).finally(() => {
        clearAllData();
        window.location.reload();
        return Promise.reject(resp);
      });
    }
    return response.data;
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.msg);
    } else {
      console.error('返回拦截器', error);
      Message({
        message: error.msg || '请求数据错误',
        type: 'error',
        duration: 2 * 1000,
        showClose: true
      });
    }
    return Promise.reject(error);
  }
);



export default service;

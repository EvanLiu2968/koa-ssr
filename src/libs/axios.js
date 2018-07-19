/**
 * Created by evanliu2968
 * 自定义axios实例
 */
import axios from 'axios';
// import { message } from 'antd';
import { loading } from 'component/loading';
// import Cookies from 'js-cookie';

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/i.test(method));
}

axios.defaults.withCredentials = true

// 创建axios实例，设置默认参数
const service = axios.create({
  baseURL: '',  // api's baseURL
  headers: {
    'Content-Type': 'application/json;charset=UTF-8' // 'application/json' || 'application/x-www-form-urlencoded'
  },
  withCredentials : true, //跨域携带cookie
  // xsrfCookieName: 'csrfToken', // 用作 xsrf token 的值的cookie的名称
  // xsrfHeaderName: 'x-csrf-token', // 承载 xsrf token 的值的 HTTP 头的名称
  timeout: 10000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (!csrfSafeMethod(config.method) && !config.headers['x-csrf-token']) {
  //   var csrfToken = Cookies.get('csrfToken');
  //   config.headers['x-csrf-token'] = csrfToken; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  // }
  if(config.loading){
    loading.show()
  }
  return config;
}, error => {
  loading.hide()
  console.log(error);
  return Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  response => {
    loading.hide()
    const res = response.data;
    return res;
    if (res.code !== '00') {
      // message.error(res.message || '请求异常');
      // 400:非法请求; 401:未授权;  403:服务器拒绝请求; 404:资源未找到
      // if (res.status === 401 || res.status === 403) {
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '提示', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.commit('loginOut');
      //   })
      // }
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  error => {
    loading.hide()
    console.log(error);
    return Promise.reject(error);
  }
);

export default service
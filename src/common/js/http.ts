import axios, { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { showFailToast } from 'vant';

type ResponseModel<D> = {
  errno: number;
  errmsg: string;
  data: D;
  lid: number;
  errCode: string;
  st: number;
} & {
  // 兼容外部api返回结构
  code: number;
  message: string;
  result: D;
};

axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // @ts-ignore
    if (config.method === 'post' && !['multipart/form-data', 'application/json'].includes(config.headers?.['Content-Type'])) {
      // @ts-ignore
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = stringify(config.data);
    }
    // @ts-ignore
    config.headers['platform'] = 'locr';
    config.proxy = false;
    return config;
  },
  (error) => {
    showFailToast(error);
    return Promise.reject(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 兼容外部api响应结构
    let errno = response.data.errno;
    if (errno === undefined) {
      errno = response.data.code;
    }
    if (errno === 0) {
      return response.data;
    } else if (errno === 100001) {
      // 未登录时退出重定向
      location.href = 'http://127.0.0.1/logout';
    } else {
      // 兼容外部api响应结构
      let errmsg = response.data.errmsg;
      if (errmsg === undefined) {
        errmsg = response.data.message;
      }
      showFailToast(errmsg);
    }
    return response.data;
  },
  (error) => {
    if (error.res !== undefined) {
      showFailToast(`服务异常\r\n ${error.res.status}`);
      return Promise.reject({});
    } else {
      showFailToast(`请求异常\r\n ${error.message}`);
    }
    console.log('http response error: ', error);
    return Promise.reject({});
  },
);

export default {
  get<T = any>(url: string, params?: object, headers?: any, extConfig?: object): Promise<ResponseModel<T>> {
    if (params !== undefined) {
      Object.assign(params, { _t: new Date().getTime() });
    } else {
      params = { _t: new Date().getTime() };
    }
    return axios({ method: 'get', url, params, headers, ...extConfig }) as unknown as Promise<AxiosResponse<ResponseModel<T>>['data']>;
  },

  // 不常更新的数据用这个
  getData<T = any>(url: string, params?: object): Promise<ResponseModel<T>> {
    return axios({ method: 'get', url, params }) as unknown as Promise<AxiosResponse<ResponseModel<T>>['data']>;
  },

  // get function which params without timestamp
  fetch<T = any>(url: string, params?: object, headers?: any, extConfig?: object): Promise<ResponseModel<T>> {
    return axios({ method: 'get', url, params, headers, ...extConfig }) as unknown as Promise<AxiosResponse<ResponseModel<T>>['data']>;
  },

  post<T = any>(url: string, params?: object, config?: object): Promise<ResponseModel<T>> {
    return axios.post(url, params, config) as unknown as Promise<AxiosResponse<ResponseModel<T>>['data']>;
  },
};

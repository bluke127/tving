import axios from 'axios';

import { unknownObj, AxiosResponse } from 'types/index';
export const API_KEY = '4872db6098f1cdb0d58bb445f402dd28'; // TMDB API Key
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (config) {
    return config.data as AxiosResponse;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const api = {
  get: async ({
    url,
    query,
    many = false,
  }: {
    baseUrl: string;
    url: string;
    query: any;
    many: Boolean;
  }) => {
    const method = 'get';
    const params = query;
    const result = await instance({
      url,
      method,
      params,
    });
    return (result as AxiosResponse) || (many ? [] : {});
  },
  post: ({
    baseURL,
    url,
    query,
  }: {
    baseURL?: string;
    url?: any;
    query?: any;
  }) => {
    const params = query;
    // const result = instance({ baseURL });
    console.log(baseURL, '베이스');
    instance.defaults.baseURL = baseURL;
    return instance.post(url, params);
  },
  delete: ({ url, query }: { baseURL: string; url: any; query: any }) => {
    const params = query;
    return instance.delete(url, {
      data: params,
    });
  },
  put: ({
    baseURL,
    url,
    query,
  }: {
    baseURL?: string;
    url?: any;
    query?: any;
  }) => {
    const params = query;
    return instance.put(url, params);
  },
};
export default api;

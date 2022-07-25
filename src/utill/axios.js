import axios from 'axios';
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
    return config.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const api = {
  get: async ({ url, query, many = false }) => {
    const method = 'get';
    const params = query;
    const result = await instance({
      url,
      method,
      params,
    });
    return result || (many ? [] : {});
  },
  post: ({ url, query }) => {
    const params = query;
    return instance.post(url, params);
  },
  delete: ({ url, query }) => {
    const params = query;
    return instance.delete(url, {
      data: params,
    });
  },
  put: ({ url, query }) => {
    const params = query;
    return instance.put(url, params);
  },
};
export default api;

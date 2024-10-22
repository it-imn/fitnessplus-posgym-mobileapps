import axios from 'axios';
import {getToken} from './local-storage';

export const API_BASE_URL = 'https://staging-api.positive-gym.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: '',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await getToken();
    console.log(token, 'token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

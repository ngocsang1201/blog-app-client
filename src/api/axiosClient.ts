import axios from 'axios';
import queryString from 'query-string';
import { localStorageKey } from '~/constants';
import { env, variables } from '~/utils/env';
import { showToast } from '~/utils/toast';

const SERVER_URL = env(variables.serverUrl) || '';
const BASE_URL = `${SERVER_URL}/api`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  if (token && config.url !== env(variables.cdnUrl)) {
    config.headers && (config.headers.Authorization = `Bearer ${token}`);
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data ?? response,
  (error) => {
    const errorData = error.response.data;
    const exceptErrorName: string[] = [];
    if (!exceptErrorName.includes(errorData.name)) {
      showToast(errorData.name, 'error');
    }
    return Promise.reject(errorData);
  }
);

export default axiosClient;

import { env, variables } from 'utils/env';
import axiosClient from './axiosClient';

const cdnApi = {
  getImageUrl(data: FormData) {
    const url = env(variables.cdnUrl);
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default cdnApi;

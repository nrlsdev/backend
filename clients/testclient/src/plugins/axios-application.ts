import { initializeApplicationAPI } from '@/utils/axios-accessor';
import { Context } from '@nuxt/types';
import { AxiosInstance } from 'axios';
import { Agent } from 'https';

function axiosSystem(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const applicationAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: context.$config.applicationBaseUrl,
  }) as AxiosInstance;

  applicationAPI.defaults.httpsAgent = new Agent({
    rejectUnauthorized: false,
  });

  applicationAPI.defaults.validateStatus = () => {
    return true;
  };

  inject('applicationAPI', applicationAPI);
  initializeApplicationAPI(applicationAPI, context);
}

export default axiosSystem;

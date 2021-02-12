import { initializeSystemAPI } from '@/utils/axios-accessor';
import { Context } from '@nuxt/types';
import { AxiosInstance } from 'axios';
import { Agent } from 'https';

function axiosSystem(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const systemAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: context.$config.systemBaseUrl,
  }) as AxiosInstance;

  systemAPI.defaults.httpsAgent = new Agent({
    rejectUnauthorized: false,
  });

  systemAPI.defaults.validateStatus = () => {
    return true;
  };

  systemAPI.defaults.headers['Content-Language'] = context.app.i18n.locale;

  inject('systemAPI', systemAPI);
  initializeSystemAPI(systemAPI, context);
}

export default axiosSystem;

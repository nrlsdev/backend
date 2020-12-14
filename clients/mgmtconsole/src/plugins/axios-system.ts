import { initializeSystemAPI } from '@/utils/axios-accessor';
import { Context } from '@nuxt/types';
import { AxiosInstance } from 'axios';

function axiosSystem(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const systemAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: context.$config.systemBaseUrl,
  }) as AxiosInstance;

  systemAPI.defaults.validateStatus = (statusCode: number) => {
    return statusCode !== 401 && statusCode !== 403;
  };
  systemAPI.defaults.headers['Content-Language'] = context.app.i18n.locale;

  inject('systemAPI', systemAPI);
  initializeSystemAPI(systemAPI, context);
}

export default axiosSystem;

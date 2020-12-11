import { initializeSystemAPI } from '@/utils/axios-accessor';
import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

function axiosSystem(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const systemAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: context.$config.systemBaseUrl,
  }) as AxiosInstance;

  inject('systemAPI', systemAPI);
  initializeSystemAPI(systemAPI, context);
}

export default axiosSystem;

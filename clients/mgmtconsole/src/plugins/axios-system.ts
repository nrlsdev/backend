import { initializeSystemAPI } from '@/utils/axios-accessor';
import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

function axiosSystem(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const systemAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8083', // ToDo
  }) as AxiosInstance;
  inject('systemAPI', systemAPI);
  initializeSystemAPI(systemAPI);
}

export default axiosSystem;

import { initializeAuthenticationAPI } from '@/utils/axios-accessor';
import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

function axiosAuthentication(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const authenticationAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8082', // ToDo
  }) as AxiosInstance;

  inject('authenticationAPI', authenticationAPI);
  initializeAuthenticationAPI(authenticationAPI);
}

export default axiosAuthentication;

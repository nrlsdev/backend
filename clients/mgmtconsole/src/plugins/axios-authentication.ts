import { initializeAuthenticationAPI } from '@/utils/axios-accessor';
import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

function axiosAuthentication(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const authenticationAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: context.$config.authenticationBaseUrl,
  }) as AxiosInstance;

  inject('authenticationAPI', authenticationAPI);
  initializeAuthenticationAPI(authenticationAPI, context);
}

export default axiosAuthentication;

import { initializeAuthenticationAPI } from '@/utils/axios-accessor';
import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';
import { Agent } from 'https';

function axiosAuthentication(
  context: Context,
  inject: (key: string, value: any) => void,
) {
  const authenticationAPI: AxiosInstance = context.$axios.create({
    withCredentials: true,
    baseURL: context.$config.authenticationBaseUrl,
  }) as AxiosInstance;

  authenticationAPI.defaults.httpsAgent = new Agent({
    rejectUnauthorized: false,
  });

  authenticationAPI.defaults.validateStatus = () => {
    return true;
  };
  authenticationAPI.defaults.headers['Content-Language'] =
    context.app.i18n.locale;

  inject('authenticationAPI', authenticationAPI);
  initializeAuthenticationAPI(authenticationAPI, context);
}

export default axiosAuthentication;

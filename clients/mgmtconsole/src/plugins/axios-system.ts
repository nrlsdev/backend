import { initializeSystemAPI } from '@/utils/axios-accessor';
import { Context } from '@nuxt/types';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { refreshToken } from '@/api/system-user-authentication';
import { parse } from 'cookie';
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

  systemAPI.defaults.validateStatus = (statusCode: number) => {
    return statusCode !== 401 && statusCode !== 403;
  };

  systemAPI.defaults.headers['Content-Language'] = context.app.i18n.locale;

  // ToDo: Refactor. Do not set httpOnly cookie this way!
  systemAPI.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const { response } = error;
      const { config } = error;

      if (!response || !config) {
        return Promise.reject(error);
      }

      config.data = config.data === undefined ? {} : config.data;

      if (response!.status === 403 && !config.data.retry) {
        config.data.retry = true;
        await refreshToken(context);

        const setCookies = context.res.getHeaders()['set-cookie'] as string[];
        const { token } = parse(setCookies[0]);

        config.headers.cookie += `; token=${token}`;

        return systemAPI(config);
      }

      return Promise.reject(error);
    },
  );

  inject('systemAPI', systemAPI);
  initializeSystemAPI(systemAPI, context);
}

export default axiosSystem;

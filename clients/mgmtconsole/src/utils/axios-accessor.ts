import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

let authenticationAPI: AxiosInstance;
let systemAPI: AxiosInstance;

export function initializeAuthenticationAPI(
  axiosInstance: AxiosInstance,
  context: Context,
) {
  authenticationAPI = axiosInstance;
  authenticationAPI.defaults.validateStatus = () => true;
  setAuthenticationContentLanguageHeader(context.app.i18n.locale);
}

export function initializeSystemAPI(
  axiosInstance: AxiosInstance,
  context: Context,
) {
  systemAPI = axiosInstance;
  systemAPI.defaults.validateStatus = () => true;
  setSystemContentLanguageHeader(context.app.i18n.locale);
}

export function setAuthenticationContentLanguageHeader(
  contentLanguage: string,
) {
  authenticationAPI.defaults.headers['Content-Language'] = contentLanguage;
}

export function setSystemContentLanguageHeader(contentLanguage: string) {
  authenticationAPI.defaults.headers['Content-Language'] = contentLanguage;
}

export { authenticationAPI, systemAPI };

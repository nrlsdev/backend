import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

let authenticationAPI: AxiosInstance;
let systemAPI: AxiosInstance;

export function initializeAuthenticationAPI(
  axiosInstance: AxiosInstance,
  _context: Context,
) {
  authenticationAPI = axiosInstance;
}

export function initializeSystemAPI(
  axiosInstance: AxiosInstance,
  _context: Context,
) {
  systemAPI = axiosInstance;
}

export { authenticationAPI, systemAPI };

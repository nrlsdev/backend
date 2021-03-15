import { AxiosInstance } from 'axios';
import { Context } from '@nuxt/types';

let authenticationAPI: AxiosInstance;
let applicationAPI: AxiosInstance;

export function initializeAuthenticationAPI(
  axiosInstance: AxiosInstance,
  _context: Context,
) {
  authenticationAPI = axiosInstance;
}

export function initializeApplicationAPI(
  axiosInstance: AxiosInstance,
  _context: Context,
) {
  applicationAPI = axiosInstance;
}

export { authenticationAPI, applicationAPI };

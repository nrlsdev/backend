import { AxiosInstance } from 'axios';

let authenticationAPI: AxiosInstance;
let systemAPI: AxiosInstance;

export function initializeAuthenticationAPI(axiosInstance: AxiosInstance) {
  authenticationAPI = axiosInstance;
  authenticationAPI.defaults.validateStatus = () => true;
}

export function initializeSystemAPI(axiosInstance: AxiosInstance) {
  systemAPI = axiosInstance;
  systemAPI.defaults.validateStatus = () => true;
}

export { authenticationAPI, systemAPI };

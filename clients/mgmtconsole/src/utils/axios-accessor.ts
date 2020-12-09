import { AxiosInstance } from 'axios';

let authenticationAPI: AxiosInstance;

export function initializeAuthenticationAPI(axiosInstance: AxiosInstance) {
  authenticationAPI = axiosInstance;
  authenticationAPI.defaults.validateStatus = () => true;
}

export { authenticationAPI };

import { AxiosInstance } from 'axios';

let authenticationAPI: AxiosInstance;

export function initializeAuthenticationAPI(axiosInstance: AxiosInstance) {
  authenticationAPI = axiosInstance;
}

export { authenticationAPI };

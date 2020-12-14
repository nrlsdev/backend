import { authenticationAPI } from '@/utils/axios-accessor';
import { ResponseMessage } from '@backend/messagehandler';
import { Context } from '@nuxt/types';

export async function signUp(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
) {
  const response = await authenticationAPI.post('/auth/signup', {
    email,
    firstname,
    lastname,
    password,
  });
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return !error ? null : error;
  }

  return null;
}

export async function signIn(email: string, password: string) {
  const response = await authenticationAPI.post('/auth/signin', {
    email,
    password,
  });
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return !error ? null : error;
  }

  return null;
}

export async function signOut(context: Context) {
  const response = await authenticationAPI.get('/auth/signout');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return;
  }

  context.$cookies.removeAll();
}

export async function validateAndRefreshToken(context: Context) {
  const hasValidToken: boolean = await validateToken();

  if (hasValidToken) {
    return true;
  }

  const wasTokenRefreshed = await refreshToken(context);

  return wasTokenRefreshed !== null;
}

export async function validateToken() {
  const response = await authenticationAPI.get('/validate/token');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return false;
  }

  return true;
}

export async function refreshToken(context: Context) {
  const response = await authenticationAPI.get('/auth/refreshtoken');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    signOut(context);
    return null;
  }

  if (process.server) {
    context.res.setHeader('set-cookie', response.headers['set-cookie']);
    return response.headers['set-cookie'] as [];
  }

  return [];
}

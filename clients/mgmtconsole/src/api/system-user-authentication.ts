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
  const response = await authenticationAPI.post('/auth/signout');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return false;
  }

  try {
    context.$cookies.removeAll();
  } catch {
    return false;
  }

  return true;
}

export async function isUserAuthenticated() {
  const response = await authenticationAPI.get('/auth');

  return response.status === 200;
}

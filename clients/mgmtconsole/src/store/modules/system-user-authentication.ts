import { VuexModule, Module, getModule, Action } from 'vuex-module-decorators';
import { store } from '@/store';
import { authenticationAPI } from '@/utils/axios-accessor';
import { ResponseMessage } from '@backend/messagehandler';
import { Context } from '@nuxt/types';

export interface SystemUserAuthenticationState {}

@Module({
  dynamic: true,
  store,
  name: 'systemuserauthentication',
})
class SystemUserAuthentication
  extends VuexModule
  implements SystemUserAuthenticationState {
  @Action
  public async signUp(payload: {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  }) {
    const response = await authenticationAPI.post('/auth/signup', payload);
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      return !error ? null : error;
    }

    return null;
  }

  @Action
  public async signIn(payload: { email: string; password: string }) {
    const response = await authenticationAPI.post('/auth/signin', payload);
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      return !error ? null : error;
    }

    return null;
  }

  @Action
  public async signOut(context: Context) {
    const response = await authenticationAPI.get('/auth/signout');
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      return;
    }
    context.$cookies.removeAll();
    context.redirect('/account/signin');
  }

  @Action
  public async validateAndRefreshToken(context: Context) {
    const hasValidToken: boolean = await this.validateToken();

    if (hasValidToken) {
      return true;
    }

    const wasTokenRefreshed: boolean = await this.refreshToken(context);

    return wasTokenRefreshed;
  }

  @Action
  private async validateToken() {
    const response = await authenticationAPI.get('/validate/token');
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      return false;
    }

    return true;
  }

  @Action
  private async refreshToken(context: Context) {
    const response = await authenticationAPI.get('/auth/refreshtoken');
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      this.signOut(context);
      return false;
    }

    if (process.server) {
      context.res.setHeader('Set-Cookie', response.headers['set-cookie']);
    }

    return true;
  }
}

export const SystemUserAuthenticationModule = getModule(
  SystemUserAuthentication,
);

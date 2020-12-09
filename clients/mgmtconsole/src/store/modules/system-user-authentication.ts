import {
  VuexModule,
  Module,
  getModule,
  Mutation,
  Action,
} from 'vuex-module-decorators';
import { store } from '@/store';
import { authenticationAPI } from '@/utils/axios-accessor';
import { ResponseMessage } from '@backend/messagehandler';

export interface SystemUserAuthenticationState {
  token: string | null;
}

@Module({
  dynamic: true,
  store,
  name: 'systemuserauthentication',
})
class SystemUserAuthentication
  extends VuexModule
  implements SystemUserAuthenticationState {
  public token: string | null = null;

  @Mutation
  public setToken(token: string | null) {
    this.token = token;
    window.$nuxt.$cookies.set('user_token', token);
  }

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

    this.setToken(null);

    if (error) {
      return error;
    }
    return null;
  }

  @Action
  public async signIn(payload: { email: string; password: string }) {
    const response = await authenticationAPI.post('/auth/signin', payload);
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error) {
      this.setToken(null);
      return error;
    }

    const { data }: any = responseMessage.body;
    const { token } = data;

    this.setToken(token);

    return null;
  }
}

export const SystemUserAuthenticationModule = getModule(
  SystemUserAuthentication,
);

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
  token: string;
}

@Module({
  dynamic: true,
  store,
  name: 'systemuserauthentication',
})
class SystemUserAuthentication
  extends VuexModule
  implements SystemUserAuthenticationState {
  public token: string = '';

  @Mutation
  public setToken(token: string) {
    this.token = token;
    window.$nuxt.$cookies.set('token', token);
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

    this.setToken('');

    if (error) {
      return error;
    }
    return null;
  }
}

export const SystemUserAuthenticationModule = getModule(
  SystemUserAuthentication,
);

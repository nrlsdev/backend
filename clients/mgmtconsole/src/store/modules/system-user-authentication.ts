import { VuexModule, Module, getModule, Action } from 'vuex-module-decorators';
import { store } from '@/store';
import { authenticationAPI } from '@/utils/axios-accessor';

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
  public async signUp(data: {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  }) {
    const response = await authenticationAPI.post('/auth/signup', data);
    console.log(response);
  }
}

export const SystemUserAuthenticationModule = getModule(
  SystemUserAuthentication,
);

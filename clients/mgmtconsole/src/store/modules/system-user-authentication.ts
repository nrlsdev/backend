import { VuexModule, Module, getModule } from 'vuex-module-decorators';
import { store } from '@/store';

export interface SystemUserAuthenticationState {}

@Module({
  dynamic: true,
  store,
  name: 'systemuserauthentication',
})
class SystemUserAuthentication
  extends VuexModule
  implements SystemUserAuthenticationState {}

export const SystemUserAuthenticationModule = getModule(
  SystemUserAuthentication,
);

import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { SystemUserAuthenticationState } from '@/store/modules/system-user-authentication';
import { SystemUserState } from '@/store/modules/system-user';

Vue.use(Vuex);

export interface RootState {
  systemUserAuthentication: SystemUserAuthenticationState;
  systemUser: SystemUserState;
}

export const store: Store<RootState> = new Store<RootState>({});

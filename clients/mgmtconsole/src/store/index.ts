import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { SystemUserAuthenticationState } from '@/store/modules/system-user-authentication';

Vue.use(Vuex);

export interface RootState {
  systemUserAuthentication: SystemUserAuthenticationState;
}

export const store: Store<RootState> = new Store<RootState>({});

import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { SystemUserState } from '@/store/modules/system-user';

Vue.use(Vuex);

export interface RootState {
  systemUser: SystemUserState;
}

export const store: Store<RootState> = new Store<RootState>({});

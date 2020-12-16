import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { SystemUserState } from '@/store/modules/system-user';
import { ApplicationState } from '@/store/modules/application';

Vue.use(Vuex);

export interface RootState {
  systemUser: SystemUserState;
  application: ApplicationState;
}

export const store: Store<RootState> = new Store<RootState>({});

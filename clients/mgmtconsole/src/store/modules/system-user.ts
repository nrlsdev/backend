import {
  VuexModule,
  Module,
  getModule,
  MutationAction,
} from 'vuex-module-decorators';
import { store } from '@/store';
import { getUserData } from '@/api/system-user';

export interface UserData {
  email: string;
  firstname: string;
  lastname: string;
}

export interface SystemUserState {
  userdata: UserData | null;
}

@Module({
  dynamic: true,
  store,
  name: 'systemuser',
})
class SystemUser extends VuexModule implements SystemUserState {
  public userdata: UserData | null = null;

  @MutationAction({ mutate: ['userdata'] })
  public async loadUserData() {
    const userdata = await getUserData();

    return { userdata };
  }
}

export const SystemUserModule = getModule(SystemUser);

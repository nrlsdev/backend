import {
  VuexModule,
  Module,
  getModule,
  MutationAction,
} from 'vuex-module-decorators';
import { store } from '@/store';
import { systemAPI } from '@/utils/axios-accessor';
import { ResponseMessage } from '@backend/messagehandler';

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
    const response = await systemAPI.get('/systemuser');
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      return { userdata: null };
    }

    return { userdata: responseMessage.body.data as UserData };
  }
}

export const SystemUserModule = getModule(SystemUser);

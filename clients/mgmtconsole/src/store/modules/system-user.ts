import {
  VuexModule,
  Module,
  getModule,
  Action,
  Mutation,
} from 'vuex-module-decorators';
import { store } from '@/store';
import { systemAPI } from '@/utils/axios-accessor';
import { ResponseMessage } from '@backend/messagehandler';

export interface SystemUserState {
  userdata?: { email: string; firstname: string; lastname: string };
}

@Module({
  dynamic: true,
  store,
  name: 'systemuser',
})
class SystemUser extends VuexModule implements SystemUserState {
  public userdata?: {
    email: string;
    firstname: string;
    lastname: string;
  } = undefined;

  @Mutation
  private setUserData(userdata: {
    email: string;
    firstname: string;
    lastname: string;
  }) {
    this.userdata = userdata;
  }

  @Action
  public async getUserData() {
    if (this.userdata) {
      return this.userdata!;
    }

    const response = await systemAPI.get('/systemuser');
    const responseMessage: ResponseMessage = response.data as ResponseMessage;
    const { error } = responseMessage.body;

    if (error || response.status !== 200) {
      return null;
    }

    const { email, firstname, lastname } = responseMessage.body.data as any;
    const userdata = { email, firstname, lastname };

    this.setUserData(userdata);

    return userdata;
  }
}

export const SystemUserModule = getModule(SystemUser);

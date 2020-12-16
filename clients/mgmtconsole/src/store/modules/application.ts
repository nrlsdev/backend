import { VuexModule, Module, getModule, Action } from 'vuex-module-decorators';
import { store } from '@/store';
import { createApplication } from '@/api/appication';

export interface ApplicationState {}

@Module({
  dynamic: true,
  store,
  name: 'application',
})
class Application extends VuexModule implements ApplicationState {
  @Action
  public async createApplication(payload: { bundleId: string; name: string }) {
    const error = await createApplication(payload.bundleId, payload.name);

    return error;
  }
}

export const ApplicationModule = getModule(Application);

import {
  VuexModule,
  Module,
  getModule,
  Action,
  MutationAction,
} from 'vuex-module-decorators';
import { store } from '@/store';
import {
  createApplication,
  getAllApplicationsUserIsAuthorizedFor,
} from '@/api/application';

export interface ApplicationData {
  _id: string;
  bundleId: string;
  name: string;
  image: string;
  authorizedUsers: [
    {
      userId: string;
      email: string;
    },
  ];
  invitedUsers: [
    {
      userId: string;
      email: string;
      invitationCode: string;
    },
  ];
}

export interface ApplicationState {
  applications: ApplicationData[];
}

@Module({
  dynamic: true,
  store,
  name: 'application',
})
class Application extends VuexModule implements ApplicationState {
  public applications: ApplicationData[] = [];

  @Action
  public async createApplication(payload: { bundleId: string; name: string }) {
    const error = await createApplication(payload.bundleId, payload.name);

    return error;
  }

  @MutationAction({ mutate: ['applications'] })
  public async loadApplications() {
    const applications = await getAllApplicationsUserIsAuthorizedFor();

    return { applications };
  }
}

export const ApplicationModule = getModule(Application);

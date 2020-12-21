import { MongoError } from 'mongodb';
import { Logger } from '@backend/logger';
import { Application } from '@backend/systeminterfaces';
import { ApplicationModel } from './application-schema';

export class ApplicationEntity {
  private logger: Logger = new Logger('ApplicationEntity');

  private static instance: ApplicationEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return ApplicationEntity.instance || new ApplicationEntity();
  }

  public async createApplication(application: Application) {
    try {
      const dbApplication = await ApplicationModel.create(application);

      await dbApplication.save();
    } catch (exception) {
      this.logger.error('createApplication', exception);
      return exception as MongoError;
    }

    this.logger.debug('createApplication', 'Successfully created application');

    return null;
  }

  public async getAllApplicationsUserHasAuthorizationFor(_userId: string) {
    try {
      const applications = await ApplicationModel.find({});

      return { applications: applications as Application[], error: null };
    } catch (exception) {
      return { applications: null, error: exception as Error };
    }
  }
}

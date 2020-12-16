import { Document, Schema, Model, model } from 'mongoose';
import { MongoError } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { Logger } from '@backend/logger';

export interface Application {
  _id?: string;
  bundleId: string;
  name: string;
  authorizedUsers: string[];
}

type ApplicationDocument = Application & Document;

const ApplicationSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },
  bundleId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: false },
  authorizedUsers: { type: Array, required: false, unique: false },
});

const ApplicationModel: Model<
  ApplicationDocument,
  {}
> = model<ApplicationDocument>('Application', ApplicationSchema);

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
      const dbApplication: ApplicationDocument = new ApplicationModel(
        application,
      );

      await dbApplication.save();
    } catch (exception) {
      this.logger.error('createApplication', exception);
      return exception as MongoError;
    }

    this.logger.debug('createApplication', 'Successfully created application');

    return null;
  }
}

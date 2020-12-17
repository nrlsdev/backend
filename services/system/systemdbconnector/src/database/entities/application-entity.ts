import { Document, Schema, Model, model } from 'mongoose';
import { MongoError } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { Logger } from '@backend/logger';
import { Application } from '@backend/systeminterfaces';
import { SystemUserEntity } from './system-user-entity';

type ApplicationDocument = Application & Document;

const ApplicationSystemUserRoleSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
  },
  { _id: false },
);

const ApplicationInvitedSystemUserSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    invitationCode: { type: String, required: true, unique: true },
  },
  { _id: false },
);

const ApplicationSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },
  bundleId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: false },
  authorizedUsers: {
    type: [ApplicationSystemUserRoleSchema],
    required: false,
    unique: false,
  },
  invitedUsers: {
    type: [ApplicationInvitedSystemUserSchema],
    required: false,
    unique: false,
  },
  image: { type: String, required: false, unique: false },
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

  public async getAllApplicationsUserHasAuthorizationFor(userId: string) {
    try {
      const applications = await ApplicationModel.find({})
        .select('-__v')
        .where('authorizedUsers')
        .elemMatch({ userId });

      return { applications: applications as Application[], error: null };
    } catch (exception) {
      return { applications: null, error: exception as Error };
    }
  }

  // team
  public async inviteUserToTeam(id: string, email: string) {
    const invitationCode: string = uuid().toString();

    try {
      const application = await ApplicationModel.findById(id);

      if (!application) {
        return { error: 'Invalid application id', invitationCode: null };
      }

      const userId = await SystemUserEntity.Instance.getUserIdByEmail(email);

      if (!userId) {
        return { error: 'Invalid email', invitationCode: null };
      }

      application.invitedUsers.push({
        userId,
        invitationCode,
      });

      application.save();
    } catch (exception) {
      this.logger.error('inviteUserToTeam', exception);
      return { error: exception as string, invitationCode: null };
    }

    return { error: null, invitationCode };
  }
}

import { Logger } from '@backend/logger';
import { Application } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  plugin,
  prop,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import { MongoError } from 'mongodb';
import { Types } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { AuthorizedUserSchema } from './authorized-users-schema';

@modelOptions({
  options: {
    customName: 'Application',
    allowMixed: Severity.ALLOW,
  },
})
@plugin(autopopulate)
export class ApplicationSchema implements Application {
  private static readonly logger: Logger = new Logger('ApplicationSchema');

  @prop({ required: true, unique: true })
  bundleId!: string;

  @prop({ required: true, unique: false })
  name!: string;

  @prop({ required: false, unique: false })
  image?: string;

  @prop({
    required: false,
    unique: false,
    default: [],
    type: AuthorizedUserSchema,
  })
  authorizedUsers?: AuthorizedUserSchema[];

  public static async createApplication(
    this: ReturnModelType<typeof ApplicationSchema>,
    bundleId: string,
    name: string,
    ownerId: string,
  ) {
    try {
      const dbApplication = await this.create({
        bundleId,
        name,
        authorizedUsers: [
          {
            user: Types.ObjectId(ownerId),
            role: 1,
          },
        ],
      });

      await dbApplication.save();
    } catch (exception) {
      ApplicationSchema.logger.error('createApplication', exception);
      return exception as MongoError;
    }

    ApplicationSchema.logger.debug(
      'createApplication',
      'Successfully created application',
    );

    return null;
  }

  public static async getAllApplicationsUserHasAuthorizationFor(
    this: ReturnModelType<typeof ApplicationSchema>,
    userId: string,
  ) {
    try {
      const applications = await this.find({ 'authorizedUsers.user': userId });

      return { applications: applications as Application[], error: null };
    } catch (exception) {
      ApplicationSchema.logger.error(
        'getAllApplicationsUserHasAuthorizationFor',
        exception,
      );
      return { applications: null, error: exception as Error };
    }
  }
}

export const ApplicationModel = getModelForClass(ApplicationSchema);

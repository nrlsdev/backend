import { Logger } from '@backend/logger';
import { StatusCodes } from '@backend/server';
import { Application, SystemUser } from '@backend/systeminterfaces';
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
import { v4 as uuid } from 'uuid';
import { SystemUserModel } from '../systemuser/system-user-schema';
import { AuthorizedUserSchema } from './authorized-users-schema';
import { InvitedUserSchema } from './invited-user-schema';

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

  @prop({
    required: false,
    unique: false,
    default: [],
    type: InvitedUserSchema,
  })
  invitedUsers?: InvitedUserSchema[];

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
            role: 3,
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

  public static async getApplicationByIdUserHasAuthorizationFor(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationId: string,
    userId: string,
  ) {
    try {
      const application = await this.findOne({
        'authorizedUsers.user': userId,
        '_id': applicationId,
      });

      return { application: application as Application, error: null };
    } catch (exception) {
      ApplicationSchema.logger.error(
        'getApplicationByIdUserHasAuthorizationFor',
        exception,
      );
      return { application: null, error: exception as Error };
    }
  }

  public static async inviteUserToTeam(
    this: ReturnModelType<typeof ApplicationSchema>,
    email: string,
    role: number,
    applicationId: string,
  ) {
    const invitationCode: string = `${uuid()}:${(
      new Date().getTime() +
      1000 * 60 * 60 * 24
    ).toString()}`; // ToDo: constant
    const invitedUser = await SystemUserModel.findUserByEmail(email);

    if (!invitedUser) {
      // return OK to not loose email information
      return {
        statusCode: StatusCodes.OK,
        invitationCode,
        error: null,
      };
    }

    let application = await this.findOne({
      'authorizedUsers.user': invitedUser.id!,
      '_id': applicationId,
    });

    if (application !== null) {
      return {
        statusCode: StatusCodes.CONFLICT,
        invitationCode: null,
        error: 'User is already a member of your team.',
      };
    }

    application = await this.findOne({
      'invitedUsers.user': invitedUser.id!,
      '_id': applicationId,
    });

    if (application !== null) {
      return {
        statusCode: StatusCodes.CONFLICT,
        invitationCode: null,
        error: 'User already invited to this team.',
      };
    }

    application = await this.getApplicationById(applicationId);

    if (application === null) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        invitationCode: null,
        error: 'Application not found.',
      };
    }

    const invitedUserObject = {
      user: Types.ObjectId(invitedUser.id!),
      role,
      invitationCode,
    };

    if (!application.invitedUsers) {
      application.invitedUsers = [invitedUserObject];
    } else {
      application.invitedUsers.push(invitedUserObject);
    }

    try {
      application.save();
    } catch (exception) {
      ApplicationSchema.logger.error('inviteUserToTeam', exception);
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        invitationCode: null,
        error: 'Something went wrong.',
      };
    }

    return { statusCode: StatusCodes.OK, invitationCode, error: null };
  }

  public static async acceptInvitation(
    this: ReturnModelType<typeof ApplicationSchema>,
    invitationCode: string,
    userId: string,
  ) {
    const application = await this.findOne({
      'invitedUsers.user': userId,
      'invitedUsers.invitationCode': invitationCode,
    });

    if (!application || !application.invitedUsers) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'No application found.',
      };
    }

    const invitedUsers = application.invitedUsers.filter(
      (user: InvitedUserSchema) => {
        const systemUser: SystemUser = user.user as SystemUser;

        return (
          systemUser._id.toString() === userId &&
          user.invitationCode === invitationCode
        );
      },
    );

    if (invitedUsers.length <= 0) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        error: 'Something went wrong.',
      };
    }

    const invitedUser = invitedUsers[0];
    const { role } = invitedUser;
    const systemUserObject = invitedUser.user as SystemUser;

    application.invitedUsers = application.invitedUsers.filter(
      (user: InvitedUserSchema) => {
        const systemUser: SystemUser = user.user as SystemUser;

        return (
          systemUser._id.toString() !== userId &&
          user.invitationCode !== invitationCode
        );
      },
    );

    application.authorizedUsers?.push({
      user: Types.ObjectId(systemUserObject._id!),
      role,
    });

    try {
      application.save();
    } catch (exception) {
      ApplicationSchema.logger.error('acceptInvitation', exception);
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        invitationCode: null,
        error: 'Something went wrong.',
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }

  // delete invitation
  public static async deleteInvitation(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationId: string,
    userId: string,
  ) {
    const application = await this.getApplicationById(applicationId);

    if (!application || !application.invitedUsers) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        invitationCode: null,
        error: 'No application found.',
      };
    }

    application.invitedUsers = application.invitedUsers.filter(
      (user: InvitedUserSchema) => {
        const systemUser: SystemUser = user.user as SystemUser;

        return systemUser._id.toString() !== userId;
      },
    );

    try {
      application.save();
    } catch (exception) {
      ApplicationSchema.logger.error('deleteInvitation', exception);
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        invitationCode: null,
        error: 'Something went wrong.',
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }

  // helper
  public static async getApplicationById(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationId: string,
  ) {
    const application = await this.findOne({ _id: applicationId });

    return application;
  }
}

export const ApplicationModel = getModelForClass(ApplicationSchema);

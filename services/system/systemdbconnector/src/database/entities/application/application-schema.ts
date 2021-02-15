import { Logger } from '@backend/logger';
import { StatusCodes } from '@backend/server';
import {
  Application,
  ApplicationRole,
  SystemUser,
} from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  plugin,
  prop,
  ReturnModelType,
  Severity,
  DocumentType,
} from '@typegoose/typegoose';
import { MongoError } from 'mongodb';
import { Types } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { v4 as uuid } from 'uuid';
import { SystemUserModel } from '../systemuser/system-user-schema';
import { AuthenticationSchema } from './authentication/authentication-schema';
import { AuthorizedUserSchema } from './authorized-users-schema';
import { InvitedUserSchema } from './invited-user-schema';

@modelOptions({
  options: {
    customName: 'Application',
    automaticName: false,
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
    _id: false,
    type: AuthorizedUserSchema,
  })
  authorizedUsers?: AuthorizedUserSchema[];

  @prop({
    required: false,
    unique: false,
    default: [],
    _id: false,
    type: InvitedUserSchema,
  })
  invitedUsers?: InvitedUserSchema[];

  @prop({
    required: true,
    unique: false,
    default: {},
    _id: false,
    type: AuthenticationSchema,
  })
  authentication?: AuthenticationSchema;

  public async updateAndSaveApplicationProperties(
    this: DocumentType<ApplicationSchema>,
    applicationUpdateData: Application,
    current: any = this,
    save: boolean = true,
  ) {
    const keys = Object.keys(applicationUpdateData);

    keys.forEach(async (key: string) => {
      const newValue = (applicationUpdateData as any)[key];
      const updateValue = (current as any)[key];

      if (newValue instanceof Object) {
        await this.updateAndSaveApplicationProperties(
          newValue,
          updateValue,
          false,
        );
      } else {
        // eslint-disable-next-line no-param-reassign
        current[key] = newValue;
      }
    });

    if (save) {
      await this.save();
    }
  }

  public static async updateApplicationData(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationData: Application,
    applicationId: string,
  ) {
    const application = await this.findApplicationById(applicationId);

    if (!application) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'No application found.',
      };
    }

    try {
      await application.updateAndSaveApplicationProperties(applicationData);
    } catch (exception) {
      ApplicationSchema.logger.error('updateApplicationData', exception);
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        invitationCode: null,
        error: 'Something went wrong.',
      };
    }

    return { statusCode: StatusCodes.OK, error: undefined };
  }

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
            role: ApplicationRole.OWNER,
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

    application = await this.findApplicationById(applicationId);

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
    const application = await this.findApplicationById(applicationId);

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

  public static async updateAuthorizedUser(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationId: string,
    role: number,
    userId: string,
  ) {
    const application = await this.findApplicationById(applicationId);

    if (!application) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'No application found.',
      };
    }

    let userIndex = -1;
    for (let i = 0; i < application.authorizedUsers!.length; i += 1) {
      const systemUser = application.authorizedUsers![i].user as SystemUser;

      userIndex = i;

      if (systemUser._id!.toString() === userId) {
        break;
      }
    }

    application.authorizedUsers![userIndex].role = role;

    try {
      application.save();
    } catch (exception) {
      ApplicationSchema.logger.error('updateAuthorizedUser', exception);
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

  // application role
  public static async getUserApplicationRole(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationId: string,
    userId: string,
  ) {
    const application = await this.findApplicationById(applicationId);

    if (!application) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        role: undefined,
        error: 'No application found.',
      };
    }

    let role: number = -1;
    application.authorizedUsers?.forEach((user: AuthorizedUserSchema) => {
      const systemUser: SystemUser = user.user as SystemUser;

      if (systemUser._id.toString() === userId) {
        role = user.role;
      }
    });

    if (role === -1) {
      return {
        statusCode: StatusCodes.FORBIDDEN,
        role: undefined,
        error: 'User is not authorized.',
      };
    }

    return {
      statusCode: StatusCodes.OK,
      role,
      error: undefined,
    };
  }

  // helper
  public static async findApplicationById(
    this: ReturnModelType<typeof ApplicationSchema>,
    applicationId: string,
  ) {
    const application = await this.findOne({ _id: applicationId });

    return application;
  }
}

export const ApplicationModel = getModelForClass(ApplicationSchema);

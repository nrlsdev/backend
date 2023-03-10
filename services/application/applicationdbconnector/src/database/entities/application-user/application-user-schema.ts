import { ApplicationUser } from '@backend/applicationinterfaces';
import {
  getModelForClass,
  modelOptions,
  Severity,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Logger } from '@backend/logger';
import { getReasonPhrase, StatusCodes } from '@backend/server';
import { Constants } from '@backend/constants';
import { MongoError } from 'mongodb';
import { hash, compare } from 'bcryptjs';
import { ApplicationUserAccountsSchema } from './application-user-accounts-schema';
import { MongoErrorCode } from '../../error-codes';
import { DatabaseEntitySchema } from '../database-entity-schema';
import { ApplicationUserUserdataModel } from '../application-user-userdata/application-user-userdata-schema';

@modelOptions({
  options: {
    customName: 'ApplicationUser',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserSchema extends DatabaseEntitySchema implements ApplicationUser {
  private static readonly logger: Logger = new Logger('ApplicationUserSchema');

  @prop({
    unique: false,
    required: true,
    default: {},
    _id: false,
    type: ApplicationUserAccountsSchema,
  })
  public accounts!: ApplicationUserAccountsSchema;

  // email and password
  public static async signUpEmailAndPassword(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
    password: string,
    userdata: any,
    activationCode: string,
  ) {
    try {
      const hashedPassword: string = await hash(
        password!,
        Constants.PASSWORD_BCRYPT_SALT_LENGTH,
      );

      const createdUser = await this.create({
        accounts: {
          emailAndPassword: {
            email: email.toLowerCase(),
            password: hashedPassword,
            activationCode,
            activated: false,
          },
        },
      });

      await ApplicationUserUserdataModel.createUserdata(createdUser._id, userdata);
    } catch (exception) {
      ApplicationUserSchema.logger.fatal('signUpEmailAndPassword', exception);

      if (exception instanceof MongoError) {
        const mongoError: MongoError = exception as MongoError;

        if (mongoError.code === MongoErrorCode.DUPLICATE_KEY) {
          return {
            statusCode: StatusCodes.CONFLICT,
            error: 'User with this email already exists.',
          };
        }
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Could not signup.',
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }

  public static async signInEmailAndPassword(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
    password: string,
  ) {
    const user = await this.getApplicationUserByEmail(email);

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'Invalid E-Mail or Password.',
        user: undefined,
      };
    }

    if (!user.accounts.emailAndPassword) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'Invalid E-Mail or Password.',
        user: undefined,
      };
    }

    if (!user.accounts.emailAndPassword.activated) {
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
        error: 'You have to activate your account first.',
        user: undefined,
      };
    }

    const doPasswordsMatch: boolean = await compare(
      password,
      user.accounts.emailAndPassword.password,
    );

    if (!doPasswordsMatch) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'Invalid E-Mail or Password.',
        user: undefined,
      };
    }

    const userdata = await ApplicationUserUserdataModel.getUserDataById(user._id);

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
      user: {
        _id: user._id,
        email: user.accounts.emailAndPassword.email,
        userdata,
      },
    };
  }

  public static async activateEmailAndPassword(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    activationCode: string,
  ) {
    const user = await this.findOne({
      'accounts.emailAndPassword.activationCode': activationCode,
    });

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'No valid activation code.',
      };
    }

    if (user.accounts.emailAndPassword) {
      user.accounts.emailAndPassword.activated = true;
      user.accounts.emailAndPassword.activationCode = undefined;
    } else {
      ApplicationUserSchema.logger.fatal(
        'activateEmailAndPassword',
        'No email and password account found to activate.',
      );

      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'No email and password account found to activate.',
      };
    }

    try {
      user.save();
    } catch (exception) {
      ApplicationUserSchema.logger.fatal('activateEmailAndPassword', exception);

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      };
    }
    return {
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }

  public static async getApplicationUserByEmail(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
  ) {
    const applicationUser = await this.findOne({
      'accounts.emailAndPassword.email': email.toLowerCase(),
    });

    return applicationUser as ApplicationUser;
  }

  // facebook
  public static async getApplicationUserByFacebookId(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    id: string,
  ) {
    const applicationUser = await this.findOne({ 'accounts.facebook.id': id });

    return applicationUser as ApplicationUser;
  }

  public static async applicationUserFacebookSignUp(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    id: string,
  ) {
    try {
      await this.create({
        accounts: {
          facebook: {
            id,
          },
        },
      });
    } catch (exception) {
      ApplicationUserSchema.logger.fatal(
        'applicationUserFacebookSignUp',
        exception,
      );

      if (exception instanceof MongoError) {
        const mongoError: MongoError = exception as MongoError;

        if (mongoError.code === MongoErrorCode.DUPLICATE_KEY) {
          return {
            statusCode: StatusCodes.CONFLICT,
            error: 'User with this facebook account already exists.',
          };
        }
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Could not signup with facebook.',
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }

  // twitter
  public static async getApplicationUserByTwitterId(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    id: string,
  ) {
    const applicationUser = await this.findOne({ 'accounts.twitter.id': id });

    return applicationUser as ApplicationUser;
  }

  public static async applicationUserTwitterSignUp(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    id: string,
  ) {
    try {
      await this.create({
        accounts: {
          twitter: {
            id,
          },
        },
      });
    } catch (exception) {
      ApplicationUserSchema.logger.fatal(
        'applicationUserTwitterSignUp',
        exception,
      );

      if (exception instanceof MongoError) {
        const mongoError: MongoError = exception as MongoError;

        if (mongoError.code === MongoErrorCode.DUPLICATE_KEY) {
          return {
            statusCode: StatusCodes.CONFLICT,
            error: 'User with this twitter account already exists.',
          };
        }
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Could not signup with twitter.',
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }

  // helper
  public static async getApplicationUserById(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    id: string,
  ) {
    const applicationUser = await this.findById(id);

    if (!applicationUser) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'No user found.',
        user: undefined,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
      user: applicationUser as ApplicationUser,
    };
  }

  public static async findUserById(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    id: string,
  ) {
    const applicationUser = await this.findById(id);

    return applicationUser;
  }
}

export const ApplicationUserModel = getModelForClass(ApplicationUserSchema);

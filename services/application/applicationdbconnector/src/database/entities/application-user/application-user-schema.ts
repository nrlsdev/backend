import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import { Logger } from '@backend/logger';
import { ApplicationUser } from '@backend/applicationinterfaces';
import { Constants } from '@backend/constants';
import { compare, hash } from 'bcryptjs';
import { ApplicationUserAuthenticationSchema } from './application-user-authentication-schema';
import { StatusCodes } from '../../../../../../../packages/applicationmessagefactory/node_modules/@backend/server';

@modelOptions({
  options: {
    customName: 'ApplicationUser',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    autoCreate: false,
  },
})
export class ApplicationUserSchema implements ApplicationUser {
  private static readonly logger: Logger = new Logger('ApplicationUserSchema');

  @prop({ unique: false, required: true, default: {}, _id: false })
  public authentication!: ApplicationUserAuthenticationSchema;

  public static async emailAndPasswordSignUp(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
    password: string,
  ) {
    const hashedPassword: string = await hash(
      password!,
      Constants.PASSWORD_BCRYPT_SALT_LENGTH,
    );

    try {
      this.create({
        authentication: {
          emailAndPassword: {
            email,
            password: hashedPassword,
          },
        },
      });
    } catch (exception) {
      ApplicationUserSchema.logger.error('emailAndPasswordSignUp', exception);
      // ToDo: Better statusCode handling
      return {
        error: exception as string,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }

    return { error: undefined, statusCode: StatusCodes.OK };
  }

  public static async emailAndPasswordSignIn(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
    password: string,
  ) {
    const applicationUser = await this.findUserByEmail(email);

    if (!applicationUser) {
      ApplicationUserSchema.logger.error(
        'emailAndPasswordSignIn',
        'No applicationuser with this email found.',
      );
      return {
        error: new Error('Invalid E-Mail or password.'),
        _id: null,
        email: null,
        statusCode: StatusCodes.UNAUTHORIZED,
      };
    }

    const { emailAndPassword } = applicationUser.authentication;
    const doPasswordsMatch: boolean = await compare(
      password,
      emailAndPassword.password,
    );

    if (!doPasswordsMatch) {
      ApplicationUserSchema.logger.error(
        'signInSystemUser',
        'Passwords do not match.',
      );
      return {
        error: new Error('Invalid E-Mail or password.'),
        _id: null,
        email: null,
        statusCode: StatusCodes.UNAUTHORIZED,
      };
    }

    return {
      error: undefined,
      _id: applicationUser._id,
      email: emailAndPassword.email,
      statusCode: StatusCodes.OK,
    };
  }

  public static async findUserByEmail(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
  ) {
    const applicationUser = await this.findOne({
      'authentication.emailAndPassword.email': email,
    });

    return applicationUser;
  }
}

export const ApplicationUserModel = getModelForClass(ApplicationUserSchema);

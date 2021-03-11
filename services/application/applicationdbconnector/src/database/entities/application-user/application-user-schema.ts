import { ApplicationUser } from '@backend/applicationinterfaces';
import {
  getModelForClass,
  modelOptions,
  Severity,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Logger } from '@backend/logger';
import { StatusCodes } from '@backend/server';
import { Constants } from '@backend/constants';
import { MongoError } from 'mongodb';
import { hash } from 'bcryptjs';
import { ApplicationUserAccountsSchema } from './application-user-accounts-schema';
import { MongoErrorCode } from '../../error-codes';

@modelOptions({
  options: {
    customName: 'ApplicationUser',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserSchema implements ApplicationUser {
  private static readonly logger: Logger = new Logger('ApplicationUserSchema');

  @prop({
    unique: false,
    required: true,
    default: {},
    type: ApplicationUserAccountsSchema,
  })
  public accounts!: ApplicationUserAccountsSchema;

  public static async signUpEmailAndPassword(
    this: ReturnModelType<typeof ApplicationUserSchema>,
    email: string,
    password: string,
  ) {
    try {
      const hashedPassword: string = await hash(
        password!,
        Constants.PASSWORD_BCRYPT_SALT_LENGTH,
      );

      await this.create({
        accounts: {
          emailAndPassword: {
            email,
            password: hashedPassword,
          },
        },
      });
    } catch (exception) {
      ApplicationUserSchema.logger.fatal('signUp', exception);

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
}

export const ApplicationUserModel = getModelForClass(ApplicationUserSchema);

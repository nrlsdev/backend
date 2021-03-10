import { SystemUser } from '@backend/systeminterfaces';
import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import { compare, hash } from 'bcryptjs';
import { Constants } from '@backend/constants';
import { Logger } from '@backend/logger';
import { MongoError } from 'mongodb';
import { getReasonPhrase, StatusCodes } from '@backend/server';

@modelOptions({
  options: {
    customName: 'SystemUser',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class SystemUserSchema implements SystemUser {
  private static readonly logger: Logger = new Logger('SystemUserSchema');

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ unique: false, required: true })
  public firstname!: string;

  @prop({ unique: false, required: true })
  public lastname!: string;

  @prop({ unique: false, required: true })
  public password!: string;

  @prop({ unique: true, required: false })
  public customerId?: string;

  public static async signUp(
    this: ReturnModelType<typeof SystemUserSchema>,
    systemUser: SystemUser,
  ) {
    const newUser: SystemUser = systemUser;
    const hashedPassword: string = await hash(
      systemUser.password!,
      Constants.PASSWORD_BCRYPT_SALT_LENGTH,
    );

    newUser.password = hashedPassword;

    try {
      const dbSystemUser = await this.create({
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        password: newUser.password,
      });

      await dbSystemUser.save();
    } catch (exception) {
      SystemUserSchema.logger.fatal('createSystemUser', exception);
      return exception as MongoError;
    }

    return null;
  }

  public static async signIn(
    this: ReturnModelType<typeof SystemUserSchema>,
    email: string,
    password: string,
  ) {
    const systemUser = await this.findUserByEmail(email);

    if (!systemUser) {
      SystemUserSchema.logger.fatal(
        'signInSystemUser',
        'No systemuser with this email found.',
      );
      return {
        error: new Error('Invalid E-Mail or password.'),
        _id: null,
        email: null,
      };
    }

    const doPasswordsMatch: boolean = await compare(
      password,
      systemUser.password,
    );

    if (!doPasswordsMatch) {
      SystemUserSchema.logger.fatal(
        'signInSystemUser',
        'Passwords do not match.',
      );
      return {
        error: new Error('Invalid E-Mail or password.'),
        _id: null,
        email: null,
      };
    }

    return { error: null, _id: systemUser._id, email: systemUser.email };
  }

  public static async getSystemuserData(
    this: ReturnModelType<typeof SystemUserSchema>,
    userId: string,
  ) {
    const systemUser = await this.findUserById(userId);

    if (!systemUser) {
      return {
        error: 'Wrong userId. Should not happen.',
        systemUser: null,
      };
    }

    return {
      error: undefined,
      systemUser: {
        _id: systemUser._id,
        email: systemUser.email,
        firstname: systemUser.firstname,
        lastname: systemUser.lastname,
      },
    };
  }

  // Payment Information
  public static async getCustomerId(
    this: ReturnModelType<typeof SystemUserSchema>,
    userId: string,
  ) {
    const systemUser = await this.findUserById(userId);

    if (!systemUser) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'Wrong userId. Should not happen.',
        customerId: undefined,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      error: undefined,
      customerId: systemUser.customerId,
    };
  }

  public static async setCustomerId(
    this: ReturnModelType<typeof SystemUserSchema>,
    userId: string,
    customerId: string,
  ) {
    const systemUser = await this.findUserById(userId);

    if (!systemUser) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        error: 'Wrong userId. Should not happen.',
      };
    }

    systemUser.customerId = customerId;

    try {
      systemUser.save();
    } catch (exception) {
      SystemUserSchema.logger.fatal('setCustomerId', exception);

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

  // Helper

  public static async findUserById(
    this: ReturnModelType<typeof SystemUserSchema>,
    userId: string,
  ) {
    const systemUser = await this.findById(userId);

    return systemUser;
  }

  public static async findUserByEmail(
    this: ReturnModelType<typeof SystemUserSchema>,
    email: string,
  ) {
    const systemUser = await this.findOne({ email });

    return systemUser;
  }
}

export const SystemUserModel = getModelForClass(SystemUserSchema);

import { MongoError } from 'mongodb';
import { Logger } from '@backend/logger';
import { hash, compare } from 'bcryptjs';
import { Constants } from '@backend/constants';
import { SystemUser } from '@backend/systeminterfaces';
import { SystemUserModel } from './system-user-schema';

export class SystemUserEntity {
  private logger: Logger = new Logger('SystemUserEntity');

  private static instance: SystemUserEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return SystemUserEntity.instance || new SystemUserEntity();
  }

  public async createSystemUser(systemUser: SystemUser) {
    const hashedPassword: string = await hash(
      systemUser.password!,
      Constants.PASSWORD_BCRYPT_SALT_LENGTH,
    );
    const sytemUserToCreate = systemUser;

    sytemUserToCreate.password = hashedPassword;

    try {
      const dbSystemUser = await SystemUserModel.create(sytemUserToCreate);

      await dbSystemUser.save();
    } catch (exception) {
      this.logger.error('createSystemUser', exception);
      return exception as MongoError;
    }

    this.logger.debug('createSystemUser', 'Successfully created system user');

    return null;
  }

  public async signInSystemUser(email: string, password: string) {
    const systemUser = await SystemUserModel.findOne({ email });

    if (!systemUser) {
      this.logger.error('signInSystemUser', 'No systemuser with email found.');
      return {
        error: new Error('Invalid E-Mail or password.'),
        _id: null,
        email: null,
      };
    }

    const doPasswordsMatch: boolean = await compare(
      password,
      systemUser.password!,
    );

    if (!doPasswordsMatch) {
      this.logger.error('signInSystemUser', 'Passwords do not match.');
      return {
        error: new Error('Invalid E-Mail or password.'),
        _id: null,
        email: null,
      };
    }

    return { error: null, _id: systemUser._id, email: systemUser.email };
  }

  public async getSystemuserData(systemUserId: string) {
    const systemUser = await SystemUserModel.findOne({
      _id: systemUserId,
    });

    if (!systemUser) {
      return {
        error: 'Wrong userId. Should not happen.',
        email: null,
        firstname: null,
        lastname: null,
      };
    }

    return {
      error: null,
      email: systemUser.email,
      firstname: systemUser.firstname,
      lastname: systemUser.lastname,
    };
  }

  public async getUserIdByEmail(email: string) {
    const systemUser = await SystemUserModel.findOne({
      email,
    });

    if (!systemUser) {
      return null;
    }

    return systemUser._id as string;
  }
}

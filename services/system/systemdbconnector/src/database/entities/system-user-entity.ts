import { Document, Schema, Model, model } from 'mongoose';
import { MongoError } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { Logger } from '@backend/logger';
import { hash, compare } from 'bcryptjs';

export interface SystemUser {
  _id?: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

type SystemUserDocument = SystemUser & Document;

const SystemUserSchema: Schema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true, unique: false },
  lastname: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
});

const SystemUserModel: Model<
  SystemUserDocument,
  {}
> = model<SystemUserDocument>('SystemUser', SystemUserSchema);

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
    const hashedPassword: string = await hash(systemUser.password!, 10);
    const sytemUserToCreate = systemUser;

    sytemUserToCreate.password = hashedPassword;

    try {
      const dbSystemUser: SystemUserDocument = new SystemUserModel(
        sytemUserToCreate,
      );

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
      return new Error('Invalid E-Mail or password.');
    }

    const doPasswordsMatch: boolean = await compare(
      password,
      systemUser.password!,
    );

    if (!doPasswordsMatch) {
      this.logger.error('signInSystemUser', 'Passwords do not match.');
      return new Error('Invalid E-Mail or password.');
    }

    return null;
  }
}

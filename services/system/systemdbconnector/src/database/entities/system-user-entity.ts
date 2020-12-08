import { Document, Schema, Model, model } from 'mongoose';
import { MongoError } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { Logger } from '@backend/logger';

export interface SystemUser {
  _id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
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
    try {
      const dbSystemUser: SystemUserDocument = new SystemUserModel(systemUser);
      await dbSystemUser.save();
      this.logger.debug('createSystemUser', 'Successfully created system user');
    } catch (exception) {
      this.logger.error('createSystemUser', exception);
      return exception as MongoError;
    }

    return null;
  }
}

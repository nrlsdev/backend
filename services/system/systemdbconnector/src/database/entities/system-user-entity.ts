import { Document, Schema, Model, model } from 'mongoose';
import { v4 as uuid } from 'uuid';

interface SystemUser extends Document {
  _id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
}

const SystemUserSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: uuid,
  },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true, unique: false },
  lastname: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
});

const SystemUserModel: Model<SystemUser, {}> = model<SystemUser>(
  'SystemUser',
  SystemUserSchema,
);

console.log(SystemUserModel); // ToDo: Remove

export class SystemUserEntity {
  private static instance: SystemUserEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return SystemUserEntity.instance || new SystemUserEntity();
  }
}

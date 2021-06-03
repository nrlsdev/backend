import { ApplicationUserSession } from '@backend/applicationinterfaces';
import { StatusCodes } from '@backend/server';
import {
  getModelForClass,
  modelOptions,
  Severity,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { ApplicationUserSessionObjectSchema } from './application-user-session-object-schema';

@modelOptions({
  options: {
    customName: 'application_user_sessions',
    automaticName: false,
    allowMixed: Severity.ALLOW,
  },
})
export class ApplicationUserSessionSchema implements ApplicationUserSession {
  @prop({
    type: mongoose.Types.ObjectId,
    default: () => {
      return new mongoose.Types.ObjectId();
    },
  })
  public _id?: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  @prop({
    unique: false,
    required: true,
    _id: false,
    type: Date,
  })
  public expires?: Date;

  @prop({
    unique: false,
    required: true,
    default: {},
    _id: false,
    type: ApplicationUserSessionObjectSchema,
  })
  public session!: ApplicationUserSessionObjectSchema;

  // push notifications
  public static async getPushNotificationDeviceIds(
    this: ReturnModelType<typeof ApplicationUserSessionSchema>,
    receiverIds: string[],
  ) {
    const userSessions: ApplicationUserSessionSchema[] = await this.find({ 'session.passport.user._id': { $in: receiverIds } });
    const pushDeviceTokens: string[] = [];

    userSessions.forEach((userSession: ApplicationUserSessionSchema) => {
      if (userSession.session.pushDeviceToken) {
        pushDeviceTokens.push(userSession.session.pushDeviceToken);
      }
    });

    return {
      deviceTokens: pushDeviceTokens,
      statusCode: StatusCodes.OK,
      error: undefined,
    };
  }
}

export const ApplicationUserSessionModel = getModelForClass(ApplicationUserSessionSchema);

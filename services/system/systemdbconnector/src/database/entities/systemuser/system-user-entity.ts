import { SystemUser } from '@backend/systeminterfaces';
import { SystemUserModel } from './system-user-schema';

export class SystemUserEntity {
  private static instance: SystemUserEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return SystemUserEntity.instance || new SystemUserEntity();
  }

  public async signUp(systemUser: SystemUser) {
    const result = await SystemUserModel.signUp(systemUser);

    return result;
  }

  public async signIn(email: string, password: string) {
    const result = await SystemUserModel.signIn(email, password);

    return result;
  }

  public async getSystemuserData(userId: string) {
    const result = await SystemUserModel.getSystemuserData(userId);

    return result;
  }

  public async getUserIdByEmail(email: string) {
    const result = await SystemUserModel.findUserByEmail(email);

    if (!result) {
      return null;
    }

    return result.id!;
  }
}

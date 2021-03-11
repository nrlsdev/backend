import { ApplicationUserModel } from './application-user-schema';

export class ApplicationUserEntity {
  private static instance: ApplicationUserEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return ApplicationUserEntity.instance || new ApplicationUserEntity();
  }

  public async signUpEmailAndPassword(
    email: string,
    password: string,
    activationCode: string,
  ) {
    const result = await ApplicationUserModel.signUpEmailAndPassword(
      email,
      password,
      activationCode,
    );

    return result;
  }

  public async activateEmailAndPassword(activationCode: string) {
    const result = await ApplicationUserModel.activateEmailAndPassword(
      activationCode,
    );

    return result;
  }
}

import { ApplicationUserModel } from './application-user-schema';

export class ApplicationUserEntity {
  private static instance: ApplicationUserEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return ApplicationUserEntity.instance || new ApplicationUserEntity();
  }

  public async emailAndPasswordSignUp(email: string, password: string) {
    const result = await ApplicationUserModel.emailAndPasswordSignUp(
      email,
      password,
    );

    return result;
  }

  public async emailAndPasswordSignIn(email: string, password: string) {
    const result = await ApplicationUserModel.emailAndPasswordSignIn(
      email,
      password,
    );

    return result;
  }
}

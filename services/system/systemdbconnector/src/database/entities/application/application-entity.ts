import { Application } from '@backend/systeminterfaces';
import { ApplicationModel } from './application-schema';

export class ApplicationEntity {
  private static instance: ApplicationEntity;

  private constructor() {
    // Empty constructor
  }

  public static get Instance() {
    return ApplicationEntity.instance || new ApplicationEntity();
  }

  public async updateApplicationData(
    applicationData: Application,
    applicationId: string,
  ) {
    const result = await ApplicationModel.updateApplicationData(
      applicationData,
      applicationId,
    );

    return result;
  }

  public async createApplication(
    bundleId: string,
    name: string,
    ownerId: string,
  ) {
    const result = await ApplicationModel.createApplication(
      bundleId,
      name,
      ownerId,
    );

    return result;
  }

  public async getAllApplicationsUserHasAuthorizationFor(userId: string) {
    const result = await ApplicationModel.getAllApplicationsUserHasAuthorizationFor(
      userId,
    );

    return result;
  }

  public async getApplicationByIdUserHasAuthorizationFor(
    applicationId: string,
    userId: string,
  ) {
    const result = await ApplicationModel.getApplicationByIdUserHasAuthorizationFor(
      applicationId,
      userId,
    );

    return result;
  }

  // application role
  public async getUserApplicationRole(applicationId: string, userId: string) {
    const result = await ApplicationModel.getUserApplicationRole(
      applicationId,
      userId,
    );

    return result;
  }

  // team
  public async inviteUserToTeam(
    email: string,
    role: number,
    applicationId: string,
  ) {
    const result = await ApplicationModel.inviteUserToTeam(
      email,
      role,
      applicationId,
    );

    return result;
  }

  public async acceptInvitation(invitationCode: string, userId: string) {
    const result = await ApplicationModel.acceptInvitation(
      invitationCode,
      userId,
    );

    return result;
  }

  public async deleteInvitation(applicationId: string, userId: string) {
    const result = await ApplicationModel.deleteInvitation(
      applicationId,
      userId,
    );

    return result;
  }

  public async updateAuthorizedUser(
    applicationId: string,
    role: number,
    userId: string,
  ) {
    const result = await ApplicationModel.updateAuthorizedUser(
      applicationId,
      role,
      userId,
    );

    return result;
  }

  // subscription
  public async getActiveSubscription(applicationId: string) {
    const result = await ApplicationModel.getActiveSubscription(applicationId);

    return result;
  }
}

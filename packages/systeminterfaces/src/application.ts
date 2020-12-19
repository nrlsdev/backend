export interface ApplicationSystemUserRole {
  userId: string;
  email?: string;
}

export interface ApplicationInvitedSystemUser {
  userId: string;
  email?: string;
  invitationCode: string;
}

export interface Application {
  _id?: string;
  bundleId: string;
  name: string;
  authorizedUsers: ApplicationSystemUserRole[];
  invitedUsers: ApplicationInvitedSystemUser[];
  image: string;
}

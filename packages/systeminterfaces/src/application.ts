export interface ApplicationSystemUserRole {
  userId: string;
}

export interface Application {
  _id?: string;
  bundleId: string;
  name: string;
  authorizedUsers: ApplicationSystemUserRole[];
  image: string;
}

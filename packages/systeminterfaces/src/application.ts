export interface Application {
  _id?: string;
  bundleId: string;
  name: string;
  image?: string;
  authorizedUsers: any[];
  invitedUsers?: any[];
}

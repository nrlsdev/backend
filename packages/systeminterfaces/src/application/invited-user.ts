import { SystemUser } from '../system-user';

export interface InvitedUser {
  user: SystemUser | any;
  role: number;
  invitationCode: string;
}

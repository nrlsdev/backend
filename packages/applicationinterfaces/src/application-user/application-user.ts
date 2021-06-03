import { DatabaseEntity } from '../database-entity';
import { ApplicationUserAccounts } from './application-user-accounts';

export interface ApplicationUser extends DatabaseEntity {
  accounts: ApplicationUserAccounts;
}

import { DatabaseEntity } from '../database-entity';

export interface ApplicationUserUserdata extends DatabaseEntity {
    userId: String;

    userdata?: any;
}

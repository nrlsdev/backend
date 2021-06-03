import { ApplicationUserSessionObject } from './application-user-session-object';

export interface ApplicationUserSession {
    _id?: any;

    expires?: Date;

    session?: ApplicationUserSessionObject;
}

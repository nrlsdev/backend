import { ApplicationUserSessionModel } from './application-user-session-schema';

export class ApplicationUserSessionEntity {
    private static instance: ApplicationUserSessionEntity;

    private constructor() {
        // Empty constructor
    }

    public static get Instance() {
        return ApplicationUserSessionEntity.instance || new ApplicationUserSessionEntity();
    }

    public async getPushNotificationDeviceIds(receiverIds: string[]) {
        const result = await ApplicationUserSessionModel.getPushNotificationDeviceIds(receiverIds);

        return result;
    }
}

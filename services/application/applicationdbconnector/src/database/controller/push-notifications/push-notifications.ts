import { PushNotificationMessage } from '@backend/applicationmessagefactory';
import { Database } from '../../database';

export async function getPushNotificationDeviceIds(
    receiverIds: string[],
) {
    const result = await Database.applicationUserSessionEntity.getPushNotificationDeviceIds(
        receiverIds,
    );

    return PushNotificationMessage.getPushNotificationDeviceTokensResponse(
        result.deviceTokens,
        result.statusCode,
        result.error,
    );
}

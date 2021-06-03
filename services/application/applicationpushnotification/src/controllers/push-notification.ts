import { PushNotificationMessage, ErrorMessage } from '@backend/applicationmessagefactory';
import { ResponseMessage, MessageQueueType, MessageSeverityType } from '@backend/messagehandler';
import PushNotifications from 'node-pushnotifications';
import { StatusCodes } from '@backend/server';
import { messageManager, pushNotificationService } from '../index'

export async function sendPushNotification(notification: any, receiverIds: string[]) {
    const getPushNotificationDeviceTokensResponse: ResponseMessage = await messageManager.sendReplyToMessage(
        PushNotificationMessage.getPushNotificationDeviceTokensRequest(receiverIds),
        MessageQueueType.APPLICATION_DBCONNECTOR,
        MessageSeverityType.APPLICATION_PUSH_NOTIFICATIONS,
    );
    const pushNotificationResponseData: any = getPushNotificationDeviceTokensResponse.body.data;
    const pushNotificationResults: PushNotifications.Result[] = await pushNotificationService.send(pushNotificationResponseData.deviceTokens ?? [], notification);

    if (pushNotificationResults.length <= 0) {
        return ErrorMessage.errorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Could not send push notification(s).',
        );
    }

    const pushNotificationResult: PushNotifications.Result = pushNotificationResults[0];

    if (pushNotificationResult.failure > 0) {
        return ErrorMessage.errorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Could not send (all) push notification(s).',
        );
    }

    return PushNotificationMessage.sendPushNotificationResponse(
        StatusCodes.OK,
    );
}

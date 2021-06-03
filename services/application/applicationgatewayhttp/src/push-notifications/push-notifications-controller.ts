import { ErrorMessage, PushNotificationMessage } from '@backend/applicationmessagefactory';
import { MessageQueueType, MessageSeverityType, ResponseMessage } from '@backend/messagehandler';
import { Request, Response, StatusCodes } from '@backend/server';
import { messageManager } from '../message-manager';

export async function registerDevice(request: Request, response: Response) {
    const { userId, deviceToken } = request.body;

    if (!userId || !deviceToken) {
        const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

        response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

        return;
    }

    (request.session as any).pushDeviceToken = deviceToken;

    const responseMessage: ResponseMessage = PushNotificationMessage.registerDeviceResponse(StatusCodes.OK);

    response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

export async function sendPushNotification(request: Request, response: Response) {
    const { notification, receiverIds } = request.body;

    if (!notification || !receiverIds) {
        const errorResponseMessage: ResponseMessage = ErrorMessage.unprocessableEntityErrorResponse();

        response.status(errorResponseMessage.meta.statusCode).send(errorResponseMessage).end();

        return;
    }

    const responseMessage: ResponseMessage = await messageManager.sendReplyToMessage(
        PushNotificationMessage.sendPushNotificationRequest(notification, receiverIds),
        MessageQueueType.APPLICATION_PUSH_NOTIFICATIONS,
        MessageSeverityType.APPLICATION_PUSH_NOTIFICATIONS,
    );

    response.status(responseMessage.meta.statusCode).send(responseMessage).end();
}

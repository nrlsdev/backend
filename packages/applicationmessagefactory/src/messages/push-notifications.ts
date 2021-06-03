import { RequestMessage, ResponseMessage } from '@backend/messagehandler';

export class PushNotificationMessage {
    public static readonly TYPE_APPLICATION_PUSH_NOTIFICATIONS_SEND: string =
        'application_push_notifications_send';

    public static readonly TYPE_APPLICATION_PUSH_NOTIFICATIONS_GET_DEVICE_TOKENS: string =
        'application_push_notifications_get_device_token';

    // register device
    public static registerDeviceResponse(statusCode: number, error?: string): ResponseMessage {
        return {
            meta: {
                statusCode,
            },
            body: {
                error,
            },
        };
    }

    // send message
    public static sendPushNotificationRequest(notification: any, receiverIds: string[]): RequestMessage { // ToDo: Notification type (npm push notification package)
        return {
            meta: {
                type: PushNotificationMessage.TYPE_APPLICATION_PUSH_NOTIFICATIONS_SEND,
            },
            body: {
                data: {
                    notification,
                    receiverIds,
                },
            },
        };
    }

    public static sendPushNotificationResponse(statusCode: number, error?: string): ResponseMessage {
        return {
            meta: {
                statusCode,
            },
            body: {
                error,
            },
        };
    }

    // get push notification device tokens
    public static getPushNotificationDeviceTokensRequest(receiverIds: string[]): RequestMessage { // ToDo: Notification type (npm push notification package)
        return {
            meta: {
                type: PushNotificationMessage.TYPE_APPLICATION_PUSH_NOTIFICATIONS_GET_DEVICE_TOKENS,
            },
            body: {
                data: {
                    receiverIds,
                },
            },
        };
    }

    public static getPushNotificationDeviceTokensResponse(deviceTokens: string[], statusCode: number, error?: string): ResponseMessage {
        return {
            meta: {
                statusCode,
            },
            body: {
                data: {
                    deviceTokens,
                },
                error,
            },
        };
    }
}

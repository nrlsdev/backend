import { MessageManager, MessageQueueType, MessageSeverityType, RequestMessage } from '@backend/messagehandler';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { ErrorMessage, PushNotificationMessage } from '@backend/applicationmessagefactory';
import PushNotifications, { Settings as PushNotificationSettings } from 'node-pushnotifications';
import { getCert } from './cert-manager';
import { sendPushNotification } from './controllers/push-notification';

const { mhHost, mhPort } = ApplicationConfiguration.applicationmessagehandler;
const pushNotificationSettings: PushNotificationSettings = {
    apn: {
        token: {
            key: getCert('certs', 'GroupsplaceAPNS', 'p8'),
            keyId: '2549S6BA97',
            teamId: 'Z3QLSA3842',
        },
        production: false,
    },
};
export const pushNotificationService: PushNotifications = new PushNotifications(pushNotificationSettings);
export const messageManager: MessageManager = MessageManager.create({
    hostname: mhHost,
    port: mhPort,
});

startup();

async function startup() {
    messageManager.createRPCServer(
        MessageQueueType.APPLICATION_PUSH_NOTIFICATIONS,
        MessageSeverityType.APPLICATION_PUSH_NOTIFICATIONS,
        onPushNotificationMessage,
    );
}

async function onPushNotificationMessage(requestMessage: RequestMessage) {
    const { type } = requestMessage.meta;
    const { data }: any = requestMessage.body;

    if (!type) {
        return ErrorMessage.unprocessableEntityErrorResponse();
    }

    switch (type) {
        case PushNotificationMessage.TYPE_APPLICATION_PUSH_NOTIFICATIONS_SEND: {
            const { notification, receiverIds } = data;
            const result = await sendPushNotification(notification, receiverIds);

            return result;
        }
        default: {
            return ErrorMessage.unprocessableEntityErrorResponse(
                `Message of type '${type}' not implemented!`,
            );
        }
    }
}

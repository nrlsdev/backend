import { Router } from '@backend/server';
import { registerDevice, sendPushNotification } from './push-notifications-controller';

const pushNotificationsRouter: Router = Router();

pushNotificationsRouter.post('/register', registerDevice);

pushNotificationsRouter.post('/send', sendPushNotification);

export { pushNotificationsRouter };

import { MessageManager } from '@backend/messagehandler';
import { SystemConfiguration } from '@backend/systemconfiguration';

const { mhHost, mhPort } = SystemConfiguration.systemmessagehandler;

export const messageManager = MessageManager.create({
  hostname: mhHost,
  port: mhPort,
});

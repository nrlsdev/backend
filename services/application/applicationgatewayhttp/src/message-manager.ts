import { MessageManager } from '@backend/messagehandler';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';

const { mhHost, mhPort } = ApplicationConfiguration.applicationmessagehandler;

export const messageManager = MessageManager.create({
  hostname: mhHost,
  port: mhPort,
});

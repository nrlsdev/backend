import { MessageManager } from '@backend/messagehandler';

export const messageManager = MessageManager.create({
  hostname: 'localhost',
  port: 5672,
});

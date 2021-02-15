import { ResponseMessage } from '@backend/messagehandler';
import { UserData } from '@/store/modules/system-user';
import { systemAPI } from '@/utils/axios-accessor';

export async function getUserData() {
  const response = await systemAPI.get('/systemuser');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return null;
  }

  return responseMessage.body.data as UserData;
}

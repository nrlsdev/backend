import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';

export async function createApplication(bundleId: string, name: string) {
  const response = await systemAPI.post('/application/create', {
    bundleId,
    name,
  });
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return error!;
  }

  return null;
}

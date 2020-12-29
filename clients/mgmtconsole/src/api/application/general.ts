import { ResponseMessage } from '@backend/messagehandler';
import { Application, minifyObject } from '@backend/systeminterfaces';
import { systemAPI } from '@/utils/axios-accessor';

export async function updateGeneralInfo(
  applicationId: string,
  application?: Application | null | undefined,
) {
  const minifiedApplication = minifyObject(application);
  const response = await systemAPI.put(
    `/application/${applicationId}/general/`,
    {
      application: minifiedApplication,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return error!;
  }

  return null;
}

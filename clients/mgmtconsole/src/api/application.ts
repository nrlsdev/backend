import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';
import { ApplicationData } from '@/store/modules/application';

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

export async function getAllApplicationsUserIsAuthorizedFor() {
  const response = await systemAPI.get('/application');
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return [];
  }

  const { applications } = responseMessage.body.data as any;

  return applications as ApplicationData[];
}

export async function getApplicationById(id: string) {
  const response = await systemAPI.get(`/application/${id}`);
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return null;
  }

  const { application } = responseMessage.body.data as any;

  return application as ApplicationData;
}

export async function acceptInvitationCode(invitationCode: string) {
  const response = await systemAPI.post(
    `/application/team/accept/${invitationCode}`,
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return false;
  }

  return true;
}

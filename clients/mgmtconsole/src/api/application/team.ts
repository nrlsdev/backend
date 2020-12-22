import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';

export async function inviteUserToTeam(
  email: string,
  role: number,
  applicationId: string,
) {
  const response = await systemAPI.post('/application/team/invite', {
    email,
    role,
    applicationId,
  });
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return error!;
  }

  return null;
}

export async function acceptInvitation(invitationCode: string) {
  const response = await systemAPI.post('/application/team/accept', {
    invitationCode,
  });
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return false;
  }

  return true;
}

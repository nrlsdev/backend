import { ResponseMessage } from '@backend/messagehandler';
import { systemAPI } from '@/utils/axios-accessor';

export async function inviteUserToTeam(
  email: string,
  role: number,
  applicationId: string,
) {
  const response = await systemAPI.post(
    `/application/${applicationId}/team/invite`,
    {
      email,
      role,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return error!;
  }

  return null;
}

export async function acceptInvitation(
  applicationId: string,
  invitationCode: string,
) {
  const response = await systemAPI.post(
    `/application/${applicationId}/team/accept`,
    {
      invitationCode,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return false;
  }

  return true;
}

export async function deleteInvitedUser(applicationId: string, userId: string) {
  const response = await systemAPI.delete(
    `/application/${applicationId}/team/invite/${userId}`,
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return false;
  }

  return true;
}

export async function editAuthorizedUser(
  applicationId: string,
  role: number,
  userId: string,
) {
  const response = await systemAPI.put(
    `/application/${applicationId}/team/${userId}`,
    {
      role,
    },
  );
  const responseMessage: ResponseMessage = response.data as ResponseMessage;
  const { error } = responseMessage.body;

  if (error || response.status !== 200) {
    return error;
  }

  return null;
}

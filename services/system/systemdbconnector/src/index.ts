import { Logger } from '@backend/logger';
import {
  MessageManager,
  MessageQueueType,
  MessageSeverityType,
  RequestMessage,
} from '@backend/messagehandler';
import {
  SystemUserMessage,
  ErrorMessage,
  ApplicationMessage,
  ApplicationTeamMessage,
} from '@backend/systemmessagefactory';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { SystemUser } from '@backend/systeminterfaces';
import { Database } from './database/database';
import { signUp, signIn, getSystemuserData } from './controller/system-user';
import {
  updateApplicationData,
  createApplication,
  getAllApplicationsUserHasAuthorizationFor,
  getApplicationByIdUserHasAuthorizationFor,
  getUserApplicationRole,
} from './controller/application/application';
import {
  inviteUserToTeam,
  acceptInvitation,
  deleteInvitation,
  updateAuthorizedUser,
} from './controller/application/team';

const logger: Logger = new Logger('systemdbconnector::index');
const { mhHost, mhPort } = SystemConfiguration.systemmessagehandler;
const messageManager: MessageManager = MessageManager.create({
  hostname: mhHost,
  port: mhPort,
});

startup();

async function startup() {
  await connectToDatabase();

  messageManager.createRPCServer(
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.SYSTEM_USER,
    onSystemUserMessage,
  );

  messageManager.createRPCServer(
    MessageQueueType.SYSTEM_DBCONNECTOR,
    MessageSeverityType.APPLICATION,
    onApplicationMessage,
  );
}

async function connectToDatabase() {
  const {
    dbHost,
    dbPort,
    dbName,
    dbUsername,
    dbPassword,
  } = SystemConfiguration.systemdbconnector;

  try {
    await Database.connect(dbHost, dbPort, dbName, dbUsername, dbPassword);
    logger.info('connectToDatabase', 'Connected to the system database');
  } catch (exception) {
    logger.error('connectToDatabase', exception.message);
  }
}

async function onSystemUserMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    case SystemUserMessage.TYPE_SYSTEM_USER_CREATE: {
      return signUp(requestMessage.body.data as SystemUser);
    }
    case SystemUserMessage.TYPE_SYSTEM_USER_SIGN_IN: {
      const { data }: any = requestMessage.body;

      return signIn(data.email, data.password);
    }
    case SystemUserMessage.TYPE_SYSTEM_USER_DATA: {
      const { data }: any = requestMessage.body;

      return getSystemuserData(data.systemUserId);
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse();
    }
  }
}

async function onApplicationMessage(requestMessage: RequestMessage) {
  const { type } = requestMessage.meta;

  if (!type) {
    return ErrorMessage.unprocessableEntityErrorResponse();
  }

  switch (type) {
    case ApplicationMessage.TYPE_APPLICATION_UPDATE_DATA: {
      const { data }: any = requestMessage.body;
      const { applicationId, applicationData } = data;

      return updateApplicationData(applicationData, applicationId);
    }
    case ApplicationMessage.TYPE_APPLICATION_CREATE: {
      const { data }: any = requestMessage.body;
      const { bundleId, name, ownerId } = data;

      return createApplication(bundleId, name, ownerId);
    }
    case ApplicationMessage.TYPE_APPLICATION_GET_ALL_APPLICATIONS_USER_HAS_AUTHORIZATION_FOR: {
      const { data }: any = requestMessage.body;

      return getAllApplicationsUserHasAuthorizationFor(data.userId);
    }
    case ApplicationMessage.TYPE_APPLICATION_GET_APPLICATION_BY_APPLICATION_ID_USER_HAS_AUTHORIZATION_FOR: {
      const { data }: any = requestMessage.body;

      return getApplicationByIdUserHasAuthorizationFor(
        data.applicationId,
        data.userId,
      );
    }
    case ApplicationMessage.TYPE_APPLICATION_GET_USER_ROLE_FOR_APPLICATION: {
      const { data }: any = requestMessage.body;

      return getUserApplicationRole(data.applicationId, data.userId);
    }
    case ApplicationTeamMessage.TYPE_APPLICATION_TEAM_INVITE_USER_TO_TEAM: {
      const { data }: any = requestMessage.body;

      return inviteUserToTeam(data.email, data.role, data.applicationId);
    }
    case ApplicationTeamMessage.TYPE_APPLICATION_TEAM_ACCEPT_INVITATION: {
      const { data }: any = requestMessage.body;

      return acceptInvitation(data.invitationCode, data.userId);
    }
    case ApplicationTeamMessage.TYPE_APPLICATION_TEAM_DELETE_INVITATION: {
      const { data }: any = requestMessage.body;

      return deleteInvitation(data.applicationId, data.userId);
    }
    case ApplicationTeamMessage.TYPE_APPLICATION_TEAM_UPDATE_AUTHORIZED_USER: {
      const { data }: any = requestMessage.body;

      return updateAuthorizedUser(data.applicationId, data.role, data.userId);
    }
    default: {
      return ErrorMessage.unprocessableEntityErrorResponse();
    }
  }
}

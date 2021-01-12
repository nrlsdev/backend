import { Server } from '@backend/server';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';
import { authenticationRouter } from './application/private/authentication/authentication-router';

const { applicationgatewayhttp } = ApplicationConfiguration;
const privateServer: Server = new Server(
  applicationgatewayhttp.private.host,
  applicationgatewayhttp.private.port,
  true,
);
const publicServer: Server = new Server(
  applicationgatewayhttp.public.host,
  applicationgatewayhttp.public.port,
  true,
);

privateServer.useJsonMiddleware();

publicServer.useJsonMiddleware();

privateServer.Application.use('/auth', authenticationRouter);

privateServer.start();

publicServer.start();

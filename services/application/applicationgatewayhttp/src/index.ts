import { Server } from '@backend/server';
import { ApplicationConfiguration } from '@backend/applicationconfiguration';

const { applicationgatewayhttp } = ApplicationConfiguration;
const authenticationServer: Server = new Server(
  applicationgatewayhttp.authentication.host,
  applicationgatewayhttp.authentication.port,
  true,
);
const applicationServer: Server = new Server(
  applicationgatewayhttp.application.host,
  applicationgatewayhttp.application.port,
  true,
);

authenticationServer.useJsonMiddleware();

applicationServer.useJsonMiddleware();

authenticationServer.start();

applicationServer.start();

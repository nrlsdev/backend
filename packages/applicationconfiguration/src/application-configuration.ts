import { config } from 'dotenv';
import { join } from 'path';

export const ApplicationConfiguration = getApplicationConfiguration(
  process.env.NODE_ENV === 'development',
);

function getApplicationConfiguration(development: boolean) {
  config({
    path: join(
      __dirname,
      'config',
      development ? 'development' : 'production',
      'config.env',
    ),
  });

  return {
    applicationdbconnector: {
      dbHost: process.env.APPLICATION_DATABASE_HOST || '',
      dbPort: (process.env.APPLICATION_DATABASE_PORT || 0) as number,
      dbName: process.env.APPLICATION_DATABASE_NAME || '',
      dbUsername: process.env.APPLICATION_DATABASE_USERNAME || '',
      dbPassword: process.env.APPLICATION_DATABASE_PASSWORD || '',
    },
    applicationmessagehandler: {
      mhHost: process.env.APPLICATION_MESSAGEHANDLER_HOST || '',
      mhPort: (process.env.APPLICATION_MESSAGEHANDLER_PORT || 0) as number,
    },
    applicationgatewayhttp: {
      private: {
        protocol: process.env.APPLICATIONGATEWAYHTTP_PRIVATE_PROTOCOL || '',
        host: process.env.APPLICATIONGATEWAYHTTP_PRIVATE_HOST || '',
        port: (process.env.APPLICATIONGATEWAYHTTP_PRIVATE_PORT || 0) as number,
      },
      public: {
        protocol: process.env.APPLICATIONGATEWAYHTTP_PUBLIC_PROTOCOL || '',
        host: process.env.APPLICATIONGATEWAYHTTP_PUBLIC_HOST || '',
        port: (process.env.APPLICATIONGATEWAYHTTP_PUBLIC_PORT || 0) as number,
      },
    },
  };
}

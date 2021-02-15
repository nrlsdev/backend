import { config } from 'dotenv';
import { join } from 'path';

export const SystemConfiguration = getSystemConfiguration(
  process.env.NODE_ENV === 'development',
);

function getSystemConfiguration(development: boolean) {
  config({
    path: join(
      __dirname,
      'config',
      development ? 'development' : 'production',
      'config.env',
    ),
  });

  return {
    systemdbconnector: {
      dbHost: process.env.SYSTEM_DATABASE_HOST || '',
      dbPort: (process.env.SYSTEM_DATABASE_PORT || 0) as number,
      dbName: process.env.SYSTEM_DATABASE_NAME || '',
      dbUsername: process.env.SYSTEM_DATABASE_USERNAME || '',
      dbPassword: process.env.SYSTEM_DATABASE_PASSWORD || '',
    },
    systemmessagehandler: {
      mhHost: process.env.SYSTEM_MESSAGEHANDLER_HOST || '',
      mhPort: (process.env.SYSTEM_MESSAGEHANDLER_PORT || 0) as number,
    },
    systemgatewayhttp: {
      authenticationProtocol:
        process.env.SYSTEMGATEWAYHTTP_AUTHENTICATION_PROTOCOL || '',
      authenticationHost:
        process.env.SYSTEMGATEWAYHTTP_AUTHENTICATION_HOST || '',
      authenticationPort: (process.env.SYSTEMGATEWAYHTTP_AUTHENTICATION_PORT ||
        0) as number,
      systemProtocol: process.env.SYSTEMGATEWAYHTTP_SYSTEM_PROTOCOL || '',
      systemHost: process.env.SYSTEMGATEWAYHTTP_SYSTEM_HOST || '',
      systemPort: (process.env.SYSTEMGATEWAYHTTP_SYSTEM_PORT || 0) as number,
    },
    systemAuthentication: {
      jsonWebTokenSecret: process.env.JSON_WEB_TOKEN_SECRET || '',
      jsonWebTokenLifetime: (process.env.JSON_WEB_TOKEN_LIFETIME ||
        0) as number,
    },
    systemWebPage: {
      protocol: process.env.SYSTEMWEBPAGE_PROTOCOL || '',
      host: process.env.SYSTEMWEBPAGE_HOST || '',
      port: (process.env.SYSTEMWEBPAGE_PORT || 0) as number,
    },
    systemMgmtConsole: {
      protocol: process.env.SYSTEMMGMTCONSOLE_PROTOCOL || '',
      host: process.env.SYSTEMMGMTCONSOLE_HOST || '',
      port: (process.env.SYSTEMMGMTCONSOLE_PORT || 0) as number,
    },
    mail: {
      noreply: {
        host: process.env.MAIL_NOREPLY_HOST || '',
        port: (process.env.MAIL_NOREPLY_PORT || 0) as number,
        email: process.env.MAIL_NOREPLY_EMAIL || '',
        user: process.env.MAIL_NOREPLY_USER || '',
        password: process.env.MAIL_NOREPLY_PASSWORD || '',
      },
    },
    stripe: {
      apiKey: process.env.STRIPE_API_KEY || '',
      apiVersion: process.env.STRIPE_API_VERSION || '',
    },
  };
}

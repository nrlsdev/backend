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
      authentication: {
        protocol:
          process.env.APPLICATIONGATEWAYHTTP_AUTHENTICATION_PROTOCOL || '',
        host: process.env.APPLICATIONGATEWAYHTTP_AUTHENTICATION_HOST || '',
        port: (process.env.APPLICATIONGATEWAYHTTP_AUTHENTICATION_PORT ||
          0) as number,
      },
      application: {
        protocol: process.env.APPLICATIONGATEWAYHTTP_APPLICATION_PROTOCOL || '',
        host: process.env.APPLICATIONGATEWAYHTTP_APPLICATION_HOST || '',
        port: (process.env.APPLICATIONGATEWAYHTTP_APPLICATION_PORT ||
          0) as number,
      },
    },
    applicationSession: {
      secret: process.env.APPLICATION_SESSION_SECRET || '',
      resave: (process.env.APPLICATION_SESSION_RESAVE || false) as boolean,
      saveUninitialized: (process.env.APPLICATION_SESSION_SAVE_UNINITIALIZED ||
        false) as boolean,
      cookieMaxAge: (process.env.APPLICATION_SESSION_COOKIE_MAX_AGE ||
        0) as number,
      cookieHttpOnly: (process.env.APPLICATION_SESSION_COOKIE_HTTP_ONLY ||
        false) as boolean,
      cookieSecure: (process.env.APPLICATION_SESSION_COOKIE_SECURE ||
        false) as boolean,
      mongoStorageCollection:
        process.env.APPLICATION_SESSION_MONGO_STORAGE_COLLECTION || '',
    },
    mail: {
      noreply: {
        host: process.env.APPLICATION_MAIL_NOREPLY_HOST || '',
        port: (process.env.APPLICATION_MAIL_NOREPLY_PORT || 0) as number,
        email: process.env.APPLICATION_MAIL_NOREPLY_EMAIL || '',
        user: process.env.APPLICATION_MAIL_NOREPLY_USER || '',
        password: process.env.APPLICATION_MAIL_NOREPLY_PASSWORD || '',
      },
    },
  };
}

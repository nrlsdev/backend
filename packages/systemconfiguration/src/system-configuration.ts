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
    systemSession: {
      secret: process.env.SYSTEM_SESSION_SECRET || '',
      resave: (process.env.SYSTEM_SESSION_RESAVE || false) as boolean,
      saveUninitialized: (process.env.SYSTEM_SESSION_SAVE_UNINITIALIZED ||
        false) as boolean,
      cookieMaxAge: (process.env.SYSTEM_SESSION_COOKIE_MAX_AGE || 0) as number,
      cookieHttpOnly: (process.env.SYSTEM_SESSION_COOKIE_HTTP_ONLY ||
        false) as boolean,
      cookieSecure: (process.env.SYSTEM_SESSION_COOKIE_SECURE ||
        false) as boolean,
      mongoStorageCollection:
        process.env.SYSTEM_SESSION_MONGO_STORAGE_COLLECTION || '',
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
      authenticationAPIProtocol:
        process.env.SYSTEMMGMTCONSOLE_AUTHENTICATION_API_PROTOCOL || '',
      authenticationAPIHost:
        process.env.SYSTEMMGMTCONSOLE_AUTHENTICATION_API_HOST || '',
      authenticationAPIPort: (process.env
        .SYSTEMMGMTCONSOLE_AUTHENTICATION_API_PORT || 0) as number,
      systemAPIProtocol:
        process.env.SYSTEMMGMTCONSOLE_SYSTEM_API_PROTOCOL || '',
      systemAPIHost: process.env.SYSTEMMGMTCONSOLE_SYSTEM_API_HOST || '',
      systemAPIPort: (process.env.SYSTEMMGMTCONSOLE_SYSTEM_API_PORT ||
        0) as number,
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
    subscriptions: [
      {
        id: (process.env.SUBSCRIPTION_OPTION_BASIC_ID || 0) as number,
        name: process.env.SUBSCRIPTION_OPTION_BASIC_NAME || '',
        priceMonthId: process.env.SUBSCRIPTION_OPTION_BASIC_PRICE_MONTH || '',
        priceYearId: process.env.SUBSCRIPTION_OPTION_BASIC_PRICE_YEAR || '',
        readRequests: (process.env.SUBSCRIPTION_OPTION_BASIC_READ_REQUESTS ||
          0) as number,
        writeRequests: (process.env.SUBSCRIPTION_OPTION_BASIC_WRITE_REQUESTS ||
          0) as number,
        dataStorageInGB: (process.env
          .SUBSCRIPTION_OPTION_BASIC_DATA_STORAGE_IN_GB || 0) as number,
        trial: (process.env.SUBSCRIPTION_OPTION_BASIC_TRIAL ||
          false) as boolean,
      },
      {
        id: (process.env.SUBSCRIPTION_OPTION_PLUS_ID || 0) as number,
        name: process.env.SUBSCRIPTION_OPTION_PLUS_NAME || '',
        priceMonthId: process.env.SUBSCRIPTION_OPTION_PLUS_PRICE_MONTH || '',
        priceYearId: process.env.SUBSCRIPTION_OPTION_PLUS_PRICE_YEAR || '',
        readRequests: (process.env.SUBSCRIPTION_OPTION_PLUS_READ_REQUESTS ||
          0) as number,
        writeRequests: (process.env.SUBSCRIPTION_OPTION_PLUS_WRITE_REQUESTS ||
          0) as number,
        dataStorageInGB: (process.env
          .SUBSCRIPTION_OPTION_PLUS_DATA_STORAGE_IN_GB || 0) as number,
        trial: (process.env.SUBSCRIPTION_OPTION_PLUS_TRIAL || false) as boolean,
      },
      {
        id: (process.env.SUBSCRIPTION_OPTION_PRO_ID || 0) as number,
        name: process.env.SUBSCRIPTION_OPTION_PRO_NAME || '',
        priceMonthId: process.env.SUBSCRIPTION_OPTION_PRO_PRICE_MONTH || '',
        priceYearId: process.env.SUBSCRIPTION_OPTION_PRO_PRICE_YEAR || '',
        readRequests: (process.env.SUBSCRIPTION_OPTION_PRO_READ_REQUESTS ||
          0) as number,
        writeRequests: (process.env.SUBSCRIPTION_OPTION_PRO_WRITE_REQUESTS ||
          0) as number,
        dataStorageInGB: (process.env
          .SUBSCRIPTION_OPTION_PRO_DATA_STORAGE_IN_GB || 0) as number,
        trial: (process.env.SUBSCRIPTION_OPTION_PRO_TRIAL || false) as boolean,
      },
      {
        id: (process.env.SUBSCRIPTION_OPTION_ENTERPRISE_ID || 0) as number,
        name: process.env.SUBSCRIPTION_OPTION_ENTERPRISE_NAME || '',
        priceMonthId:
          process.env.SUBSCRIPTION_OPTION_ENTERPRISE_PRICE_MONTH || '',
        priceYearId:
          process.env.SUBSCRIPTION_OPTION_ENTERPRISE_PRICE_YEAR || '',
        readRequests: (process.env
          .SUBSCRIPTION_OPTION_ENTERPRISE_READ_REQUESTS || 0) as number,
        writeRequests: (process.env
          .SUBSCRIPTION_OPTION_ENTERPRISE_WRITE_REQUESTS || 0) as number,
        dataStorageInGB: (process.env
          .SUBSCRIPTION_OPTION_ENTERPRISE_DATA_STORAGE_IN_GB || 0) as number,
        trial: (process.env.SUBSCRIPTION_OPTION_ENTERPRISE_TRIAL ||
          false) as boolean,
      },
    ],
  };
}

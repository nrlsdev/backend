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

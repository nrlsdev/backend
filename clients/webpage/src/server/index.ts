import { Nuxt, Builder } from 'nuxt';
import { Server } from '@backend/server';
import { SystemConfiguration } from '@backend/systemconfiguration';
import { config } from '../config/nuxt.config';

const { host, port } = SystemConfiguration.systemWebPage;
const server: Server = new Server(host, port, true);
const nuxt: any = new Nuxt(config);

async function startNuxtServer() {
  await nuxt.ready();

  if (config.dev) {
    const builder = new Builder(nuxt);

    await builder.build();
  }

  server.Application.get('*', nuxt.render);
  server.start();
}

startNuxtServer();

import { Nuxt, Builder } from 'nuxt';
import { config } from '../config/nuxt.config';
import { Server } from '@backend/server';

const server: Server = new Server('', 8080);
const nuxt: any = new Nuxt(config);

async function startNuxtServer() {
  await nuxt.ready();

  if (config.dev) {
    const builder = new Builder(nuxt);

    await builder.build();
  }

  server.get('*', nuxt.render);
  server.start();
}

startNuxtServer();
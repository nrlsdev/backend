import express, { Application } from 'express';
import { Nuxt, Builder } from 'nuxt';
import { config } from '../config/nuxt.config';

const server: Application = express();
const hostname: string = '';
const port: number = 3000;
const nuxt: any = new Nuxt(config);

async function startNuxtServer() {
  await nuxt.ready();

  if (config.dev) {
    const builder = new Builder(nuxt);

    await builder.build();
  }

  server.get('*', nuxt.render);
  server.listen(port, hostname, listen);
}

function listen() {
  const host: string = hostname.length == 0 ? 'localhost' : hostname;
  console.info(`Server listening on http://${host}:${port}`);
}

startNuxtServer();

import { NuxtConfig } from '@nuxt/types';

const isDev: boolean = process.env.NODE_ENV === 'development';

export const config: NuxtConfig = {
  dev: isDev,
  mode: 'universal',
  target: 'server',
  srcDir: './src',
  buildDir: './out',
  telemetry: false,
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },
  css: [],
  plugins: ['@/plugins/axios-authentication', '@/plugins/axios-application'],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/color-mode'],
  modules: ['@nuxtjs/axios', '@nuxtjs/svg', 'nuxt-mq', 'cookie-universal-nuxt'],
  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}',
      },
    },
  },
  build: {
    postcss: {
      plugins: {
        'postcss-nesting': {},
      },
    },
  },
  publicRuntimeConfig: {
    authenticationBaseUrl: 'https://192.168.178.36:8084',
    applicationBaseUrl: 'https://192.168.178.36:8085',
  },
};

import { NuxtConfig } from '@nuxt/types';
import { LanguageConfiguration } from './i18n/i18n-config';
import { MQConfiguration } from './nuxt-mq/nuxt-mq-config';

const isDev: boolean = process.env.NODE_ENV !== 'production'; // ToDo: production type in config

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
        content: 'width=device-width, initial-scale=1',
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
  css: [
    '@/assets/styles/common.css',
    '@/assets/styles/colors.css',
    '@/assets/styles/fonts.css',
    '@/assets/styles/bootstrap.scss',
  ],
  plugins: [
    '@/plugins/language.client',
    '@/plugins/axios-authentication',
    '@/plugins/axios-system',
  ],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/color-mode'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/svg',
    'nuxt-mq',
    'nuxt-i18n',
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
  ],
  mq: MQConfiguration,
  i18n: LanguageConfiguration,
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
};

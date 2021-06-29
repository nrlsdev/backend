import { Options } from 'nuxt-i18n';
import { enUS } from './lang/en-US';
import { deDE } from './lang/de-DE';

export const LanguageConfiguration: Options = {
  locales: [
    {
      code: 'en-US',
      iso: 'en-US',
      name: 'English',
    },
    {
      code: 'de-DE',
      iso: 'de-DE',
      name: 'Deutsch',
    },
  ],
  defaultLocale: 'en-US',
  strategy: 'no_prefix',
  vueI18n: {
    fallbackLocale: 'en-US',
    messages: {
      'en-US': enUS,
      'de-DE': deDE,
    },
  },
  detectBrowserLanguage: {
    alwaysRedirect: false,
    useCookie: false,
  },
};

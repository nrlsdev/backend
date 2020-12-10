import { NuxtVueI18n } from 'nuxt-i18n';
import { enUS } from './lang/en-US';
import { deDE } from './lang/de-DE';

export const LanguageConfiguration: NuxtVueI18n.Options.AllOptionsInterface = {
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
};

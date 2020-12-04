import { ILanguageConfiguration } from './i18n-config.interface';
import { enUS } from './lang/en-US';
import { deDE } from './lang/de-DE';

export const LanguageConfiguration: ILanguageConfiguration = {
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'English',
    },
    {
      code: 'de',
      iso: 'de-DE',
      name: 'Deutsch',
    },
  ],
  defaultLocale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
    messages: {
      en: enUS,
      de: deDE,
    },
  },
};

export interface ILanguageConfiguration {
  locales: ILocalesConfiguration[];
  defaultLocale: string;
  vueI18n: IVueI18n;
}

export interface ILocalesConfiguration {
  code: string;
  iso: string;
  name: string;
}

export interface IVueI18n {
  fallbackLocale: string;
  messages: {};
}

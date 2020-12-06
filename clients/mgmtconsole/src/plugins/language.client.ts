import { Context } from '@nuxt/types';

export default (context: Context) => {
  const localeSplit = navigator.language.split('-');
  let locale = localeSplit[0];

  if (localeSplit.length <= 0) {
    locale = context.app.defaultLocale!;
  } else {
    locale = localeSplit[0];
  }

  context.app.i18n.setLocale(locale);
};

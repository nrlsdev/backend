import { TranslateResult } from 'vue-i18n';

declare module 'vue/types/vue' {
  interface Vue {
    $t: {
      (
        key: string,
        values?: any[] | { [key: string]: any } | undefined,
      ): TranslateResult;
      (
        key: string,
        locale: string,
        values?: any[] | { [key: string]: any } | undefined,
      ): TranslateResult;
    };
  }
}

declare module '@nuxt/types' {
  interface Context {
    $t: {
      (
        key: string,
        values?: any[] | { [key: string]: any } | undefined,
      ): TranslateResult;
      (
        key: string,
        locale: string,
        values?: any[] | { [key: string]: any } | undefined,
      ): TranslateResult;
    };
  }
}

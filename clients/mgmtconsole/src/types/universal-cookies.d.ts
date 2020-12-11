import { NuxtCookies } from 'cookie-universal-nuxt';

declare module 'vue/types/vue' {
  interface Vue {
    $cookies: NuxtCookies;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $cookies: NuxtCookies;
  }
}

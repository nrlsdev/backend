import { Vue } from 'nuxt-property-decorator';

declare module 'vue/types/vue' {
  interface Vue {
    $t: (str: string) => string;
  }
}

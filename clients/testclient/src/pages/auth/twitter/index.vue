<template>
  <div>
    <button @click="onSignInWithTwitterButtonClicked">
      Sign In with Twitter
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { authenticationAPI } from '../../../utils/axios-accessor';

@Component
export default class TwitterPage extends Vue {
  protected async onSignInWithTwitterButtonClicked() {
    const result = await authenticationAPI.get('/auth/twitter', {
      withCredentials: false,
    });

    console.log(result.data);
  }
}
</script>

<style scoped></style>

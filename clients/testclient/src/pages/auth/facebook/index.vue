<template>
  <div>
    <button @click="onSignInWithFacebookButtonClicked">
      Sign In with Facebook
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { authenticationAPI } from '../../../utils/axios-accessor';

@Component
export default class FacebookPage extends Vue {
  protected async onSignInWithFacebookButtonClicked() {
    const result = await authenticationAPI.get('/auth/facebook', {
      withCredentials: false,
    });

    console.log(result.data);
  }
}
</script>

<style scoped></style>

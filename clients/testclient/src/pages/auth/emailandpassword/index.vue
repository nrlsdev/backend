<template>
  <div>
    <form @submit.prevent="onSignInButtonClicked">
      <input type="text" placeholder="E-Mail" v-model="signInEmail" />
      <input type="password" placeholder="Password" v-model="signInPassword" />
      <button>Sign In</button>
    </form>
    <form @submit.prevent="onSignUpButtonClicked">
      <input type="text" placeholder="E-Mail" v-model="signUpEmail" />
      <input type="password" placeholder="Password" v-model="signUpPassword" />
      <button>Sign Up</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { authenticationAPI } from '../../../utils/axios-accessor';

@Component
export default class EmailAndPasswordPage extends Vue {
  protected signInEmail: string = '';

  protected signInPassword: string = '';

  protected signUpEmail: string = '';

  protected signUpPassword: string = '';

  protected async onSignInButtonClicked() {
    const result = await authenticationAPI.post(
      '/auth/emailandpassword/signin',
      {
        email: this.signInEmail,
        password: this.signInPassword,
      },
    );

    console.log(result.data);
  }

  protected async onSignUpButtonClicked() {
    const result = await authenticationAPI.post(
      '/auth/emailandpassword/signup',
      {
        email: this.signUpEmail,
        password: this.signUpPassword,
      },
    );

    console.log(result.data);
  }
}
</script>

<style scoped></style>

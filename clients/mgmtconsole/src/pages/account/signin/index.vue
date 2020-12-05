<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">Sign In</h1>
      <form>
        <input
          class="account-input"
          type="email"
          placeholder="E-Mail"
          v-model="email"
          required
        />
        <input
          class="account-input"
          type="password"
          placeholder="Password"
          v-model="password"
          required
        />
        <label class="account-error-message">{{ errorMessage }}</label>
        <div class="account-actions">
          <button class="account-button" type="submit">Sign In</button>
          <n-link class="account-link" to="/account/resetpassword" prefetch
            >Forgot Password?</n-link
          >
        </div>
      </form>
    </div>
    <n-link class="account-link" to="/account/signup" prefetch
      >Create a new Account</n-link
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class AccountSignInPage extends Vue {
  protected email: string = '';
  protected password: string = '';
  protected errorMessage: string = '';

  protected layout() {
    return 'account';
  }
}
</script>

<style src="~/assets/styles/account.css" scoped></style>

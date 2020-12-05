<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">Sign Up</h1>
      <form>
        <section class="account-section">
          <input
            class="account-input"
            type="email"
            placeholder="E-Mail"
            v-model="email"
            required
          />
        </section>
        <section class="account-section">
          <input
            class="account-input"
            type="text"
            placeholder="Firstname"
            v-model="firstname"
            required
          />
          <input
            class="account-input"
            type="text"
            placeholder="Lastname"
            v-model="lastname"
            required
          />
        </section>
        <section class="account-section">
          <input
            class="account-input"
            type="password"
            placeholder="Password"
            v-model="password"
            required
          />
          <input
            class="account-input"
            type="password"
            placeholder="Verify Password"
            v-model="verifyPassword"
            required
          />
        </section>
        <label class="account-error-message">{{ errorMessage }}</label>
        <button class="account-button" type="submit">Sign Up</button>
      </form>
    </div>
    <n-link class="account-link" to="/account/signin" prefetch
      >Already got an Account</n-link
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class AccountSignUpPage extends Vue {
  protected email: string = '';
  protected firstname: string = '';
  protected lastname: string = '';
  protected password: string = '';
  protected verifyPassword: string = '';
  protected errorMessage: string = '';

  protected layout() {
    return 'account';
  }
}
</script>

<style src="~/assets/styles/account.css" scoped></style>

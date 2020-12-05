<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">Reset Password</h1>
      <form>
        <section class="account-section">
          <input
            class="account-input"
            type="email"
            placeholder="E-Mail"
            required
          />
        </section>
        <section class="account-section">
          <input
            class="account-input"
            type="password"
            placeholder="New Password"
            required
          />
          <input
            class="account-input"
            type="password"
            placeholder="Verify Password"
            required
          />
        </section>
        <label class="account-error-message"></label>
        <button class="account-button" type="submit">Reset</button>
      </form>
    </div>
    <n-link class="account-link" to="/account/signin" prefetch
      >Back to Sign In Page</n-link
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class AccountResetPasswordPage extends Vue {
  protected layout() {
    return 'account';
  }
}
</script>

<style src="~/assets/styles/account.css" scoped></style>

<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">{{ $t('StrSignUp') }}</h1>
      <form method="POST" @submit.prevent="onSignUpButtonClicked">
        <section class="account-section">
          <input
            class="account-input"
            type="email"
            :placeholder="$t('StrEmail')"
            v-model="email"
            required
          />
        </section>
        <section class="account-section">
          <input
            class="account-input"
            type="text"
            :placeholder="$t('StrFirstname')"
            v-model="firstname"
            required
          />
          <input
            class="account-input"
            type="text"
            :placeholder="$t('StrLastname')"
            v-model="lastname"
            required
          />
        </section>
        <section class="account-section">
          <input
            class="account-input"
            type="password"
            :placeholder="$t('StrPassword')"
            v-model="password"
            required
          />
          <input
            class="account-input"
            type="password"
            :placeholder="$t('StrVerifyPassword')"
            v-model="verifyPassword"
            required
          />
        </section>
        <label class="account-error-message">{{ errorMessage }}</label>
        <button class="account-button" type="submit">
          {{ $t('StrSignUp') }}
        </button>
      </form>
    </div>
    <n-link class="account-link" to="/account/signin" prefetch>{{
      $t('StrAlreadyGotAnAccount')
    }}</n-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { SystemUserAuthenticationModule } from '../../../store/modules/system-user-authentication';

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

  protected onSignUpButtonClicked() {
    if (this.password !== this.verifyPassword) {
      this.errorMessage = this.$t('StrErrorPasswordsDoNotMatch').toString();
      return;
    }

    SystemUserAuthenticationModule.signUp({
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      password: this.password,
    });
  }
}
</script>

<style src="~/assets/styles/account.css" scoped></style>

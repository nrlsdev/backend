<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">{{ $t('StrSignUp') }}</h1>
      <form method="POST" @submit.prevent="onSignUpButtonClicked">
        <section class="account-section">
          <CustomInput
            class="borderless"
            type="email"
            :placeholder="$t('StrEmail')"
            v-model="email"
            required
          />
        </section>
        <section class="account-section">
          <CustomInput
            class="borderless"
            type="text"
            :placeholder="$t('StrFirstname')"
            v-model="firstname"
            required
          />
          <CustomInput
            class="borderless"
            type="text"
            :placeholder="$t('StrLastname')"
            v-model="lastname"
            required
          />
        </section>
        <section class="account-section">
          <CustomInput
            class="borderless"
            type="password"
            :placeholder="$t('StrPassword')"
            v-model="password"
            required
          />
          <CustomInput
            class="borderless"
            type="password"
            :placeholder="$t('StrVerifyPassword')"
            v-model="verifyPassword"
            required
          />
        </section>
        <label class="account-error-message">{{ errorMessage }}</label>
        <CustomButton class="big branded" type="submit">
          {{ $t('StrSignUp') }}
        </CustomButton>
      </form>
    </div>
    <n-link class="account-link" to="/account/signin" prefetch>{{
      $t('StrAlreadyGotAnAccount')
    }}</n-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { signUp } from '../../../api/system-user-authentication';

@Component
export default class AccountSignUpPage extends Vue {
  protected email: string = '';
  protected firstname: string = '';
  protected lastname: string = '';
  protected password: string = '';
  protected verifyPassword: string = '';
  protected errorMessage: string | null = null;

  protected layout() {
    return 'account';
  }

  protected async onSignUpButtonClicked() {
    if (this.password !== this.verifyPassword) {
      this.errorMessage = this.$t('StrErrorPasswordsDoNotMatch').toString();
      return;
    }

    const error = await signUp(
      this.email,
      this.firstname,
      this.lastname,
      this.password,
    );

    this.errorMessage = error;

    if (!error) {
      this.$router.push('/account/signin');
    }
  }
}
</script>

<style src="~/assets/styles/pages/account.css" scoped></style>

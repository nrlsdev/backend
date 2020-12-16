<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">{{ $t('StrSignIn') }}</h1>
      <form method="POST" @submit.prevent="onSignInButtonClicked">
        <CustomInput
          class="account-input"
          type="email"
          :placeholder="$t('StrEmail')"
          v-model="email"
          required
        />
        <CustomInput
          class="account-input"
          type="password"
          :placeholder="$t('StrPassword')"
          v-model="password"
          required
        />
        <label class="account-error-message">{{ errorMessage }}</label>
        <div class="account-actions">
          <CustomButton class="block branded" type="submit">
            {{ $t('StrSignIn') }}
          </CustomButton>
          <n-link class="account-link" to="/account/resetpassword" prefetch>{{
            $t('StrForogtPassword')
          }}</n-link>
        </div>
      </form>
    </div>
    <n-link class="account-link" to="/account/signup" prefetch>{{
      $t('StrCreateNewAccount')
    }}</n-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { signIn } from '../../../api/system-user-authentication';

@Component
export default class AccountSignInPage extends Vue {
  protected email: string = '';
  protected password: string = '';
  protected errorMessage: string | null = null;

  protected layout() {
    return 'account';
  }

  protected async onSignInButtonClicked() {
    const error = await signIn(this.email, this.password);

    this.errorMessage = error;

    if (!error) {
      this.$router.push('/');
    }
  }
}
</script>

<style src="~/assets/styles/pages/account.css" scoped></style>

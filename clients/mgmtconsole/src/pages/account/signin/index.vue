<template>
  <div class="account-container">
    <div class="account-sheet">
      <header class="account-sheet-header">
        <VLogo class="account-branding-logo" />
        <h1 class="system-large-title-font">{{ $t('StrSignIn') }}</h1>
      </header>
      <form method="POST" @submit.prevent="onSignInButtonClicked">
        <CustomInput
          class="borderless"
          type="email"
          :placeholder="$t('StrEmail')"
          v-model="email"
          required
        />
        <CustomInput
          class="borderless"
          type="password"
          :placeholder="$t('StrPassword')"
          v-model="password"
          required
        />
        <span class="account-error-message" v-if="errorMessage">{{
          errorMessage
        }}</span>
        <CustomButton class="big branded account-button" type="submit">
          {{ $t('StrSignIn') }}
        </CustomButton>
      </form>
    </div>
    <div class="account-links">
      <n-link class="system-link-font" to="/account/resetpassword" prefetch>{{
        $t('StrForgotPassword')
      }}</n-link>
      <n-link class="system-link-font" to="/account/signup" prefetch>{{
        $t('StrCreateNewAccount')
      }}</n-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { signIn } from '../../../api/system-user/system-user-authentication';

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
      const redirectUrl: string = (this.$route.query.redirect as string) || '/';

      this.$router.push(redirectUrl);
    }
  }
}
</script>

<style src="~/assets/styles/pages/account.css" scoped></style>

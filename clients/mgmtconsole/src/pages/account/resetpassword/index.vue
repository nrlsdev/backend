<template>
  <div class="account-container">
    <div class="account-sheet">
      <header class="account-sheet-header">
        <VLogo class="account-branding-logo" />
        <h1 class="system-large-title-font">{{ $t('StrResetPassword') }}</h1>
      </header>
      <form>
        <section class="account-section">
          <CustomInput
            class="borderless"
            type="email"
            :placeholder="$t('StrEmail')"
            required
          />
        </section>
        <section class="account-section">
          <CustomInput
            class="borderless"
            type="password"
            :placeholder="$t('StrNewPassword')"
            required
          />
          <CustomInput
            class="borderless"
            type="password"
            :placeholder="$t('StrVerifyPassword')"
            required
          />
        </section>
        <span class="account-error-message" v-if="errorMessage"></span>
        <CustomButton class="big branded account-button" type="submit">
          {{ $t('StrReset') }}
        </CustomButton>
      </form>
    </div>
    <div class="account-links">
      <n-link class="system-link-font" to="/account/signin" prefetch>{{
        $t('StrBackToSignInPage')
      }}</n-link>
    </div>
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

<style src="~/assets/styles/pages/account.css" scoped></style>

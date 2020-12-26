<template>
  <div class="account-page-container">
    <div class="account-container">
      <div class="account-company-logo-container">
        <VLogo class="account-company-logo" />
      </div>
      <h1 class="account-title">{{ $t('StrResetPassword') }}</h1>
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
        <label class="account-error-message"></label>
        <CustomButton class="big branded" type="submit">
          {{ $t('StrReset') }}
        </CustomButton>
      </form>
    </div>
    <n-link class="account-link" to="/account/signin" prefetch>{{
      $t('StrBackToSignInPage')
    }}</n-link>
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

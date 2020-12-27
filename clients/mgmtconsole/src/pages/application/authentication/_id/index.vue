<template>
  <div>
    <h1 class="system-large-title-font">{{ $t('StrAuthentication') }}</h1>
    <section class="application-section">
      <div>
        <h2 class="system-title-two-font">
          {{ $t('StrAuthenticationMethods') }}
        </h2>
      </div>
      <div class="application-general-info-container">
        <Collapse
          icon="email"
          :title="$t('StrEmailAndPassword')"
          statusIcon="checkmark"
        >
        </Collapse>
        <Collapse icon="apple" :title="$t('StrApple')" statusIcon="checkmark">
        </Collapse>
        <Collapse icon="google" :title="$t('StrGoogle')" statusIcon="checkmark">
        </Collapse>
        <Collapse
          icon="microsoft"
          :title="$t('StrMicrosoft')"
          statusIcon="checkmark"
        >
        </Collapse>
        <Collapse
          icon="facebook"
          :title="$t('StrFacebook')"
          statusIcon="checkmark"
        >
        </Collapse>
        <Collapse
          icon="instagram"
          :title="$t('StrInstagram')"
          statusIcon="checkmark"
        >
        </Collapse>
        <Collapse
          icon="twitter"
          :title="$t('StrTwitter')"
          statusIcon="checkmark"
        >
        </Collapse>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationAuthenticationPage extends Vue {
  protected layout() {
    return 'application';
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>

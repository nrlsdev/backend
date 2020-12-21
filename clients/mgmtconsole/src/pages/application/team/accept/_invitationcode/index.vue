<template>
  <div class="common-wrapper application-team-accept-error-header">
    <label class="system-large-title-font" v-if="showError">
      {{ $t('StrErrorAcceptingInvitation') }}
    </label>
    <br />
    <label v-if="showError">
      {{ $t('StrErrorAskForReInvite') }}
    </label>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationTeamAcceptInvitationCodePage extends Vue {
  protected invitationCode: string = '';

  protected showError: boolean = false;

  protected created() {
    this.invitationCode = this.$route.params.invitationcode;
  }

  protected async fetch() {
    const accepted: boolean = false;

    if (!accepted) {
      this.showError = true;
      return;
    }

    this.$router.push('/');
  }
}
</script>

<style scoped>
.application-team-accept-error-header {
  text-align: center;
  margin: 50px auto;
}
</style>

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
import { acceptInvitation } from '../../../../../api/application/team';

@Component
export default class ApplicationTeamAcceptInvitationCodePage extends Vue {
  protected invitationCode: string = '';

  protected showError: boolean = false;

  protected async fetch() {
    const success: boolean = await acceptInvitation(this.invitationCode);

    if (!success) {
      this.showError = true;
    }
  }

  protected created() {
    this.invitationCode = this.$route.params.invitationcode;
  }

  protected mounted() {
    if (!this.showError) {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.application-team-accept-error-header {
  text-align: center;
  margin: 50px auto;
}
</style>

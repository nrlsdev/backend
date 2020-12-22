<template>
  <div class="common-wrapper" v-if="application">
    <h1 class="system-large-title-font">{{ $t('StrTeam') }}</h1>

    <section class="application-section">
      <div class="application-section-header">
        <h2 class="system-title-two-font">{{ $t('StrInvitedUser') }}</h2>
      </div>
      <div class="application-section-content">
        <CustomButton
          class="default application-section-button"
          @click.native="onInviteUserBtnClicked"
        >
          {{ $t('StrInviteUser') }}</CustomButton
        >
        <div class="application-team-list">
          <div
            v-for="invitedUser in application.invitedUsers"
            :key="invitedUser.user._id"
          >
            <label>{{ invitedUser.user.email }}</label>
            <label>{{ getRoleName(invitedUser.role) }}</label>
            <CustomButton class="delete">{{ $t('StrDelete') }}</CustomButton>
          </div>
        </div>
      </div>
    </section>
    <hr class="application-section-separator" />
    <section class="application-section">
      <div class="application-section-header">
        <h2 class="system-title-two-font">{{ $t('StrUser') }}</h2>
      </div>
      <div class="application-section-content">
        <div class="application-team-list">
          <div
            v-for="authorizedUser in application.authorizedUsers"
            :key="authorizedUser.user._id"
          >
            <label>{{ authorizedUser.user.email }}</label>
            <label>{{ getRoleName(authorizedUser.role) }}</label>
            <CustomButton class="default">{{ $t('StrEdit') }}</CustomButton>
          </div>
        </div>
      </div>
    </section>

    <Modal
      :id="inviteUserModalId"
      :title="$t('StrInviteUser')"
      :error="invitedUserModalError"
      positiveBtnText="StrInvite"
      :positiveBtnClickHandler="onInviteUser"
    >
      <CustomInput
        v-model="userToAddEmail"
        type="email"
        :placeholder="$t('StrEmail')"
      />
      <RadioButtonGroup
        v-model="selectedInvitUserRole"
        name="invite-user-role-radio-group"
        :items="inviteUserRoleItems"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import { ApplicationData } from '../../../../store/modules/application';
import { inviteUserToTeam } from '../../../../api/application/team';
import Modal from '../../../../components/elements/modal.vue';

@Component
export default class ApplicationTeamPage extends Vue {
  protected application: ApplicationData | null = null;

  private inviteUserModalId: string = 'application-team-invite-user';

  protected userToAddEmail: string = '';

  protected selectedInvitUserRole: number = 0;

  protected applicationId: string = '';

  protected invitedUserModalError: string = '';

  protected inviteUserRoleItems = [
    {
      id: 'invite-user-administrator-role',
      text: 'StrAdministrator',
      value: 2,
    },
    {
      id: 'invite-user-editor-role',
      text: 'StrEditor',
      value: 1,
    },
    {
      id: 'invite-user-reader-role',
      text: 'StrReader',
      value: 0,
    },
  ];

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    this.application = await getApplicationById(this.applicationId);
  }

  protected onInviteUserBtnClicked() {
    Modal.setVisible(this.$root, this.inviteUserModalId, true);
  }

  protected async onInviteUser() {
    const error = await inviteUserToTeam(
      this.userToAddEmail,
      this.selectedInvitUserRole,
      this.applicationId,
    );

    if (error) {
      this.invitedUserModalError = error;
      return;
    }

    Modal.setVisible(this.$root, this.inviteUserModalId, false);
  }

  protected getRoleName(role: number) {
    switch (role) {
      case 0: {
        return this.$t('StrReader');
      }
      case 1: {
        return this.$t('StrEditor');
      }
      case 2: {
        return this.$t('StrAdministrator');
      }
      case 3: {
        return this.$t('StrOwner');
      }
      default: {
        return null;
      }
    }
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>

<style scoped>
.application-team-list > div {
  padding: 5px 0;
  display: grid;
  grid-template-columns: 2fr auto auto;
  gap: 64px;
  border-bottom: 1px solid var(--gray6-color);
}

.application-team-list > div:last-of-type {
  border-bottom: none;
}
</style>

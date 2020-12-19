<template>
  <div class="common-wrapper" v-if="application">
    <h1 class="system-large-title-font">{{ $t('StrTeam') }}</h1>

    <section class="application-section">
      <div class="application-section-header">
        <h2 class="system-title-two-font">{{ $t('StrInvitedUser') }}</h2>
      </div>
      <div class="application-section-content">
        <CustomButton
          class="medium default application-section-button"
          @click.native="onInviteUserBtnClicked"
        >
          {{ $t('StrInviteUser') }}</CustomButton
        >
        <div class="application-team-list">
          <div
            v-for="invitedUser in application.invitedUsers"
            :key="invitedUser.userId"
          >
            <label>{{ invitedUser.email }}</label>
            <!-- ToDo: Show Role -->
            <label>[ROLE]</label>
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
            :key="authorizedUser.userId"
          >
            <label>{{ authorizedUser.email }}</label>
            <!-- ToDo: Show Role -->
            <label>[ROLE]</label>
            <CustomButton class="default">{{ $t('StrEdit') }}</CustomButton>
          </div>
        </div>
      </div>
    </section>

    <Modal
      :id="inviteUserModalId"
      :title="$t('StrInviteUser')"
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
import { getApplicationById } from '../../../../api/application';
import { ApplicationData } from '../../../../store/modules/application';

@Component
export default class ApplicationTeamPage extends Vue {
  protected application: ApplicationData | null = null;

  private inviteUserModalId: string = 'application-team-invite-user';

  protected userToAddEmail: string = '';

  protected selectedInvitUserRole: number = 1;

  protected inviteUserRoleItems = [
    {
      id: 'invite-user-administrator-role',
      text: 'StrAdministrator',
      value: 3,
    },
    {
      id: 'invite-user-editor-role',
      text: 'StrEditor',
      value: 2,
    },
    {
      id: 'invite-user-reader-role',
      text: 'StrReader',
      value: 1,
    },
  ];

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.application = await getApplicationById(this.$route.params.id);
  }

  protected onInviteUserBtnClicked() {
    this.$root.$emit('bv::show::modal', this.inviteUserModalId);
  }

  protected onInviteUser() {
    console.log(this.userToAddEmail + ', ' + this.selectedInvitUserRole);
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

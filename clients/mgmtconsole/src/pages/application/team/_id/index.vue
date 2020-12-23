<template>
  <div v-if="application">
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
        <div
          class="application-team-list"
          v-if="application.invitedUsers.length > 0"
        >
          <div
            v-for="invitedUser in application.invitedUsers"
            :key="invitedUser.user._id"
          >
            <label>{{ invitedUser.user.email }}</label>
            <label>{{ getRoleName(invitedUser.role) }}</label>
            <CustomButton
              class="delete"
              @click.native="
                onDeleteInvitedUserBtnClicked(invitedUser.user._id)
              "
              >{{ $t('StrDelete') }}</CustomButton
            >
          </div>
        </div>
        <div v-else>
          <label class="application-team-list-no-invited-users-text">
            {{ $t('StrNoInvitedUsers') }}
          </label>
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
            <CustomButton
              class="default"
              @click.native="onEditAuthorizedUserBtnClicked(authorizedUser)"
              >{{ $t('StrEdit') }}</CustomButton
            >
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
        v-model="selectedInvitedUserRole"
        name="invite-user-role-radio-group"
        :items="userRoleItems"
      />
    </Modal>

    <Modal
      :id="editUserModalId"
      :title="$t('StrEditUser')"
      :error="editUserModalError"
      positiveBtnText="StrEdit"
      :positiveBtnClickHandler="onEditedUser"
    >
      <CustomInput
        v-model="selectedEditUserEmail"
        type="email"
        :placeholder="$t('StrEmail')"
        readonly
      />
      <RadioButtonGroup
        v-model="selectedEditUserRole"
        name="edit-user-role-radio-group"
        :items="userRoleItems"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import { ApplicationData } from '../../../../store/modules/application';
import {
  deleteInvitedUser,
  editAuthorizedUser,
  inviteUserToTeam,
} from '../../../../api/application/team';
import Modal from '../../../../components/elements/modal.vue';
import { AuthorizedUser, SystemUser } from '@backend/systeminterfaces';

@Component
export default class ApplicationTeamPage extends Vue {
  protected applicationId: string = '';

  protected application: ApplicationData | null = null;

  private inviteUserModalId: string = 'application-team-invite-user';

  protected userToAddEmail: string = '';

  protected selectedInvitedUserRole: number = 0;

  protected invitedUserModalError: string = '';

  private editUserModalId: string = 'application-team-edit-user';

  protected selectedEditUserId: string = '';

  protected selectedEditUserEmail: string = '';

  protected selectedEditUserRole: number = 0;

  protected editUserModalError: string = '';

  protected userRoleItems = [
    {
      id: 'user-owner-role',
      text: 'StrOwner',
      value: 3,
      disabled: true,
    },
    {
      id: 'user-administrator-role',
      text: 'StrAdministrator',
      value: 2,
    },
    {
      id: 'user-editor-role',
      text: 'StrEditor',
      value: 1,
    },
    {
      id: 'user-reader-role',
      text: 'StrReader',
      value: 0,
    },
  ];

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    await this.loadApplication();
  }

  protected async loadApplication() {
    this.application = await getApplicationById(this.applicationId);
  }

  protected onInviteUserBtnClicked() {
    Modal.setVisible(this.$root, this.inviteUserModalId, true);
  }

  protected async onDeleteInvitedUserBtnClicked(userId: string) {
    const success = await deleteInvitedUser(this.applicationId, userId);

    if (!success) {
      // ToDo: Show Error?
      return;
    }

    await this.loadApplication();
  }

  protected async onEditAuthorizedUserBtnClicked(
    authorizedUser: AuthorizedUser,
  ) {
    const selectedUser = authorizedUser.user as SystemUser;

    this.selectedEditUserId = selectedUser._id;
    this.selectedEditUserEmail = selectedUser.email;
    this.selectedEditUserRole = authorizedUser.role;
    Modal.setVisible(this.$root, this.editUserModalId, true);
  }

  protected async onEditedUser() {
    const error = await editAuthorizedUser(
      this.applicationId,
      this.selectedEditUserRole,
      this.selectedEditUserId,
    );

    if (error) {
      this.editUserModalError = error;
      return;
    }

    this.loadApplication();

    Modal.setVisible(this.$root, this.editUserModalId, false);
  }

  protected async onInviteUser() {
    const error = await inviteUserToTeam(
      this.userToAddEmail,
      this.selectedInvitedUserRole,
      this.applicationId,
    );

    if (error) {
      this.invitedUserModalError = error;
      return;
    }

    await this.loadApplication();
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

.application-team-list-no-invited-users-text {
  color: var(--no-invited-users-text-color);
}
</style>

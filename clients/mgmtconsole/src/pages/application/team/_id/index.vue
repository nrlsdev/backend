<template>
  <div v-if="application">
    <h1 class="system-large-title-font page-header">
      {{ $t('StrTeam') }}
    </h1>
    <section
      :class="
        $mq === 'sm' ? 'application-section-mobile' : 'application-section'
      "
    >
      <h2 class="system-title-two-font">{{ $t('StrInvitedUser') }}</h2>
      <div>
        <CustomButton
          class="default application-section-button"
          @click.native="onInviteUserBtnClicked"
        >
          {{ $t('StrInviteUser') }}</CustomButton
        >
        <div
          class="application-team-list"
          :class="$mq"
          v-if="application.invitedUsers.length > 0"
        >
          <div
            class="application-team-list-item"
            :class="$mq"
            v-for="invitedUser in application.invitedUsers"
            :key="invitedUser.user._id"
          >
            <label>{{ invitedUser.user.email }}</label>
            <label class="application-team-role">{{
              getRoleName(invitedUser.role)
            }}</label>
            <div class="application-team-action-button-container" :class="$mq">
              <CustomButton
                class="delete"
                @click.native="
                  onDeleteInvitedUserBtnClicked(invitedUser.user._id)
                "
                >{{ $t('StrDelete') }}</CustomButton
              >
            </div>
          </div>
        </div>
        <div v-else>
          <label class="application-team-list-no-invited-users-text">
            {{ $t('StrNoInvitedUsers') }}
          </label>
        </div>
      </div>
    </section>
    <section
      :class="
        $mq === 'sm' ? 'application-section-mobile' : 'application-section'
      "
    >
      <h2 class="system-title-two-font">{{ $t('StrUser') }}</h2>
      <div>
        <div class="application-team-list">
          <div
            class="application-team-list-item"
            :class="$mq"
            v-for="authorizedUser in application.authorizedUsers"
            :key="authorizedUser.user._id"
          >
            <label>{{ authorizedUser.user.email }}</label>
            <label class="application-team-role">{{
              getRoleName(authorizedUser.role)
            }}</label>
            <div class="application-team-action-button-container" :class="$mq">
              <CustomButton
                class="default"
                @click.native="onEditAuthorizedUserBtnClicked(authorizedUser)"
                >{{ $t('StrEdit') }}</CustomButton
              >
            </div>
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
        class="borderless"
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
        class="borderless"
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
import {
  deleteInvitedUser,
  editAuthorizedUser,
  inviteUserToTeam,
} from '../../../../api/application/team';
import Modal from '../../../../components/elements/modal.vue';
import {
  AuthorizedUser,
  SystemUser,
  ApplicationRole,
  Application,
} from '@backend/systeminterfaces';

@Component
export default class ApplicationTeamPage extends Vue {
  private Role = ApplicationRole;

  protected applicationId: string = '';

  protected application: Application | null = null;

  private inviteUserModalId: string = 'application-team-invite-user';

  protected userToAddEmail: string = '';

  protected selectedInvitedUserRole: number = this.Role.USER;

  protected invitedUserModalError: string = '';

  private editUserModalId: string = 'application-team-edit-user';

  protected selectedEditUserId: string = '';

  protected selectedEditUserEmail: string = '';

  protected selectedEditUserRole: number = this.Role.USER;

  protected editUserModalError: string = '';

  protected userRoleItems = [
    {
      id: 'owner-role',
      text: 'StrOwner',
      value: this.Role.OWNER,
      disabled: true,
    },
    {
      id: 'administrator-role',
      text: 'StrAdministrator',
      value: this.Role.ADMINISTRATOR,
    },
    {
      id: 'user-role',
      text: 'StrUser',
      value: this.Role.USER,
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
      case this.Role.USER: {
        return this.$t('StrUser');
      }
      case this.Role.ADMINISTRATOR: {
        return this.$t('StrAdministrator');
      }
      case this.Role.OWNER: {
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

<style lang="postcss" scoped>
.application-team-list-item {
  padding: 10px 0;
  display: grid;
  align-items: center;
  &.sm {
    grid-template-columns: 1fr;
    column-gap: 20px;
  }
  &.md,
  &.lg {
    grid-template-columns: 5fr 1fr 1fr;
    gap: 20px;
  }
}

.application-team-list-item:first-of-type {
  margin-top: -10px;
}

.application-team-list-item + .application-team-list-item {
  border-top: 1px solid var(--gray6-color);
}

.application-team-role {
  color: var(--gray1-color);
}

.application-team-action-button-container {
  &.sm {
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 2;
    grid-column-end: 3;
  }
  &.md,
  &.lg {
    justify-self: end;
  }
}

.application-team-list-no-invited-users-text {
  color: var(--no-invited-users-text-color);
}
</style>

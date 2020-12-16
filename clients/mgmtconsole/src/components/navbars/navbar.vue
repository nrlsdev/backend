<template>
  <div>
    <b-navbar class="navbar" toggleable="sm">
      <b-navbar-brand to="/">
        <HLogo class="navbar-company-logo" />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="navbar-item">
          <b-avatar
            class="navbar-avatar"
            id="navbar-avatar-popover"
            tabindex="0"
            @click.native="onNavbarAvatarClicked"
          ></b-avatar>
          <b-popover
            target="navbar-avatar-popover"
            triggers="focus"
            placement="bottom"
            container="navbar-account-popover"
            :show="showAccountPopover"
            :no-fade="showAccountPopover"
          >
            <div class="navbar-account-popover-item">
              <label class="navbar-account-popover-item-label"
                >{{ firstname }} {{ lastname }}</label
              >
            </div>
            <div
              class="navbar-account-popover-item navbar-account-popover-item-link"
              @click="onNavbarPopoverSettingsItemClicked"
            >
              <label class="navbar-account-popover-item-link-label">{{
                $t('StrSettings')
              }}</label>
              <Icon icon="gear" />
            </div>
            <div
              class="navbar-account-popover-item navbar-account-popover-item-link"
              @click="onNavbarPopoverSubscriptionsItemClicked"
            >
              <label class="navbar-account-popover-item-link-label">{{
                $t('StrSubscriptions')
              }}</label>
              <Icon icon="credit-card" />
            </div>
            <div
              class="navbar-account-popover-item navbar-account-popover-item-link"
              @click="onNavbarPopoverSignOutItemClicked"
            >
              <label class="navbar-account-popover-item-link-label">{{
                $t('StrSignOut')
              }}</label>
              <Icon icon="signout" />
            </div>
          </b-popover>
          <div id="navbar-account-popover"></div>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { SystemUserModule } from '../../store/modules/system-user';
import { signOut } from '../../api/system-user-authentication';

@Component
export default class Navbar extends Vue {
  protected showAccountPopover: boolean = false;
  protected firstname: string = '';
  protected lastname: string = '';

  protected async fetch() {
    await SystemUserModule.loadUserData();

    const userdata = SystemUserModule.userdata;

    if (!userdata) {
      return;
    }

    this.firstname = userdata!.firstname;
    this.lastname = userdata!.lastname;
  }

  protected mounted() {
    this.$root.$on('bv::popover::hide', () => {
      this.showAccountPopover = false;
    });
  }

  protected onNavbarAvatarClicked() {
    this.showAccountPopover = !this.showAccountPopover;
  }

  protected onNavbarPopoverSettingsItemClicked() {
    this.showAccountPopover = false;
    this.$router.push('/settings');
  }

  protected onNavbarPopoverSubscriptionsItemClicked() {
    this.showAccountPopover = false;
    this.$router.push('/settings'); // ToDo
  }

  protected async onNavbarPopoverSignOutItemClicked() {
    this.showAccountPopover = false;
    await signOut(this.$nuxt.context);
    this.$router.push('/account/signin');
  }
}
</script>

<style scoped>
/* navbar */
.navbar {
  background-color: var(--navbar-color) !important;
  border-bottom: var(--gray5-color) 1px solid;
}

.navbar-company-logo {
  width: 80px;
  height: 40px;
}

/* avatar circle */
.navbar-avatar {
  background-color: var(--navbar-avatar-background) !important;
}

.navbar-avatar:hover {
  background-color: var(--navbar-avatar-background-hover) !important;
}

/* avatar icon */
::v-deep .navbar-avatar > * {
  fill: var(--navbar-avatar-icon-color) !important;
}

/* popover background */
::v-deep .popover {
  background-color: var(--navbar-avatar-popover-background-color) !important;
  border-color: var(--navbar-avatar-popover-border-color) !important;
}

::v-deep .arrow::after {
  border-bottom-color: var(--navbar-avatar-popover-background-color) !important;
  /* ToDo: adjust border color*/
}

/* popover item*/
.navbar-account-popover-item {
  padding: 10px 0;
}

.navbar-account-popover-item-link {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
}

.navbar-account-popover-item-link > * {
  color: var(--navbar-avatar-popover-item-link-color);
  fill: var(--navbar-avatar-popover-item-link-color);
}

.navbar-account-popover-item-link:hover > * {
  color: var(--navbar-avatar-popover-item-link-hover-color);
  fill: var(--navbar-avatar-popover-item-link-hover-color);
}

.navbar-account-popover-item {
  margin: auto 0;
}

.navbar-account-popover-item-label {
  line-height: 1em;
  color: var(--navbar-avatar-popover-item-color);
}

.navbar-account-popover-item-link-label {
  cursor: pointer;
}
</style>

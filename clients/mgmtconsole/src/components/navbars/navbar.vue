<template>
  <div class="navbar" :class="$mq">
    <nav class="navbar-container" :class="$mq">
      <div class="navbar-branding-logo-container">
        <n-link to="/">
          <HLogo class="navbar-branding-logo" />
        </n-link>
      </div>
      <div>
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
            @click="onNavbarPopoverSignOutItemClicked"
          >
            <label class="navbar-account-popover-item-link-label">{{
              $t('StrSignOut')
            }}</label>
            <Icon icon="signout" />
          </div>
        </b-popover>
        <div id="navbar-account-popover"></div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { SystemUserModule } from '../../store/modules/system-user';
import { signOut } from '../../api/system-user/system-user-authentication';

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
    this.$router.push('/user/settings/general');
  }

  protected async onNavbarPopoverSignOutItemClicked() {
    this.showAccountPopover = false;
    await signOut(this.$nuxt.context);
    this.$router.push('/account/signin');
  }
}
</script>

<style lang="postcss" scoped>
/* navbar */
.navbar {
  &.sm {
    padding: 10px 0;
  }
  &.md,
  &.lg {
    padding: 10px 20px;
  }
  border-bottom: 1px solid var(--gray5-color);
  background-color: var(--navbar-color);
}

.navbar-container {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  &.sm {
    width: 95%;
    margin: 0 auto;
  }
  &.md,
  &.lg {
    width: 100%;
  }
}

.navbar-branding-logo-container {
  justify-self: start;
}

.navbar-branding-logo {
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

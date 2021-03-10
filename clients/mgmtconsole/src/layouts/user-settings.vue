<template>
  <div class="settings-layout">
    <NavbarWithSidebar class="settings-layout-navbar" :class="$mq" />
    <UserSettingsSidebar
      class="settings-layout-sidebar"
      :class="$mq"
      v-if="showSidebar || $mq !== 'sm'"
    />
    <div class="settings-layout-content common-wrapper" :class="$mq">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['redirect-to-signin-page-if-not-signed-in'],
})
export default class SettingsLayout extends Vue {
  protected showSidebar: boolean = false;

  protected created() {
    this.$nuxt.$on('toggle-sidebar', () => {
      this.showSidebar = !this.showSidebar;
    });

    this.$nuxt.$on('hide-sidebar', () => {
      this.showSidebar = false;
    });
  }
}
</script>

<style lang="postcss" scoped>
.settings-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 250px 1fr;
}

.settings-layout-navbar {
  top: 0;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 3;
  position: sticky;
  z-index: 2;
}

.settings-layout-sidebar {
  top: 61px;
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-start: 1;
  &.sm {
    grid-column-end: 3;
    z-index: 1;
  }
  &.md,
  &.lg {
    height: calc(100vh - 61px);
    grid-column-end: 2;
    position: sticky;
  }
}

.settings-layout-sidebar:target {
  height: calc(100vh - 61px);
}

.settings-layout-content {
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-end: 3;
  overflow: hidden;
  &.sm {
    grid-column-start: 1;
  }
  &.md,
  &.lg {
    grid-column-start: 2;
  }
}
</style>

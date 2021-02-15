<template>
  <div class="application-layout">
    <NavbarWithSidebar class="application-layout-navbar" :class="$mq" />
    <Sidebar
      class="application-layout-sidebar"
      :class="$mq"
      v-if="showSidebar || $mq !== 'sm'"
    />
    <div class="application-layout-content common-wrapper" :class="$mq">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['redirect-to-signin-page-if-not-signed-in'],
})
export default class ApplicationLayout extends Vue {
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
.application-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 250px 1fr;
}

.application-layout-navbar {
  top: 0;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 3;
  position: sticky;
  z-index: 2;
}

.application-layout-sidebar {
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

.application-layout-sidebar:target {
  height: calc(100vh - 61px);
}

.application-layout-content {
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

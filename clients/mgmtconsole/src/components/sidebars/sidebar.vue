<template>
  <aside class="sidebar" :class="$mq">
    <div class="sidebar-container" :class="$mq">
      <slot />
    </div>
  </aside>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class Sidebar extends Vue {
  protected createApplicationNuxtLink(urlPath: string) {
    return `/application/${urlPath}/${this.$route.params.id}`;
  }

  protected onSidebarLinkClicked() {
    this.$nuxt.$emit('hide-sidebar');
  }
}
</script>

<style lang="postcss" scoped>
.sidebar {
  &.sm {
    padding: 20px 0;
  }
  &.md,
  &.lg {
    padding: 20px;
    border-right: 1px solid var(--gray5-color);
  }
  background-color: var(--sidebar-background-color);
}

.sidebar-container {
  overflow: hidden;
  &.sm {
    width: 95%;
    margin: 0 auto;
  }
  &.md,
  &.lg {
    width: 100%;
  }
}

.sidebar-section + .sidebar-section {
  &.sm {
    margin-top: 50px;
  }
  &.md,
  &.lg {
    margin-top: 25px;
  }
}

.sidebar-header {
  margin-bottom: 8px !important;
  color: var(--primary-color);
}

.sidebar-item-container {
  display: grid;
  gap: 8px;
}

.sidebar-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  &.sm {
    padding: 12.5px 10px;
  }
  &.sm:not(.nuxt-link-exact-active) {
    padding: 16px 10px 8px 10px;
  }
  &.md,
  &.lg {
    padding: 5px 10px;
  }
}

.sidebar-item > * {
  cursor: pointer;
}

.sidebar-item:hover:not(.nuxt-link-exact-active) > * {
  opacity: 0.75;
}

.nuxt-link-exact-active {
  border-radius: 5px;
  background-color: var(--sidebar-active-link-background-color);
}

.sidebar-item:not(.nuxt-link-exact-active)
  + .sidebar-item:not(.nuxt-link-exact-active) {
  &.sm {
    border-top: 1px solid var(--gray4-color);
  }
}
</style>

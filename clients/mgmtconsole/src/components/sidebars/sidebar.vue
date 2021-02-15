<template>
  <aside class="sidebar" :class="$mq">
    <div class="sidebar-container" :class="$mq">
      <section class="sidebar-section" :class="$mq">
        <label class="system-headline-font sidebar-header">{{
          $t('StrOverview')
        }}</label>
        <div class="sidebar-item-container">
          <n-link
            :to="createApplicationNuxtLink('statistics')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="chart-bar" />
            <label>{{ $t('StrStatistics') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('status')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="heart-monitor" />
            <label>{{ $t('StrStatus') }}</label>
          </n-link>
        </div>
      </section>

      <section class="sidebar-section" :class="$mq">
        <label class="system-headline-font sidebar-header">{{
          $t('StrApplicationSettings')
        }}</label>
        <div class="sidebar-item-container">
          <n-link
            :to="createApplicationNuxtLink('general')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="gear" />
            <label>{{ $t('StrGeneral') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('team')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="team" />
            <label>{{ $t('StrTeam') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('authentication')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="user-circle" />
            <label>{{ $t('StrAuthentication') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('database')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="ssd" />
            <label>{{ $t('StrDatabase') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('pushnotifications')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="chat" />
            <label>{{ $t('StrPushNotifications') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('ads')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="ads" />
            <label>{{ $t('StrAds') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('filestorage')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="file" />
            <label>{{ $t('StrFileStorage') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('hosting')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="globe" />
            <label>{{ $t('StrHosting') }}</label>
          </n-link>
          <n-link
            :to="createApplicationNuxtLink('security-and-privacy')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="lock" />
            <label>{{ $t('StrSecurityAndPrivacy') }}</label>
          </n-link>
        </div>
      </section>

      <section class="sidebar-section" :class="$mq">
        <label class="system-headline-font sidebar-header">{{
          $t('StrSubscription')
        }}</label>
        <div class="sidebar-item-container">
          <n-link
            :to="createApplicationNuxtLink('subscription')"
            @click.native="onSidebarLinkClicked"
            class="sidebar-item"
            :class="$mq"
          >
            <Icon icon="credit-card" />
            <label>{{ $t('StrSubscription') }}</label>
          </n-link>
        </div>
      </section>
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

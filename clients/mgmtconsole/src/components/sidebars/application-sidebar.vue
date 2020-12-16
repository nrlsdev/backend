<template>
  <div class="application-sidebar-container">
    <div class="application-sidebar-header">
      <label>{{ $t('StrOverview') }}</label>
    </div>
    <div class="application-sidebar-content">
      <n-link
        :to="createApplicationNuxtLink('statistics')"
        class="application-sidebar-item"
      >
        <Icon icon="chart-bar" />
        <label>{{ $t('StrStatistics') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('team')"
        class="application-sidebar-item"
      >
        <Icon icon="team" />
        <label>{{ $t('StrTeam') }}</label>
      </n-link>
    </div>
    <div class="application-sidebar-header">
      <label>{{ $t('StrApplicationSettings') }}</label>
    </div>
    <div class="application-sidebar-content">
      <n-link
        :to="createApplicationNuxtLink('general')"
        class="application-sidebar-item"
      >
        <Icon icon="gear" />
        <label>{{ $t('StrGeneral') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('authentication')"
        class="application-sidebar-item"
      >
        <Icon icon="user-circle" />
        <label>{{ $t('StrAuthentication') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('database')"
        class="application-sidebar-item"
      >
        <Icon icon="ssd" />
        <label>{{ $t('StrDatabase') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('pushnotifications')"
        class="application-sidebar-item"
      >
        <Icon icon="chat" />
        <label>{{ $t('StrPushNotifications') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('ads')"
        class="application-sidebar-item"
      >
        <Icon icon="ads" />
        <label>{{ $t('StrAds') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('filestorage')"
        class="application-sidebar-item"
      >
        <Icon icon="file" />
        <label>{{ $t('StrFileStorage') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('hosting')"
        class="application-sidebar-item"
      >
        <Icon icon="globe" />
        <label>{{ $t('StrHosting') }}</label>
      </n-link>
      <n-link
        :to="createApplicationNuxtLink('security-and-privacy')"
        class="application-sidebar-item"
      >
        <Icon icon="lock" />
        <label>{{ $t('StrSecurityAndPrivacy') }}</label>
      </n-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationSidebar extends Vue {
  protected createApplicationNuxtLink(urlPath: string) {
    return `/application/${urlPath}/${this.$route.params.id}`;
  }
}
</script>

<style scoped>
.application-sidebar-container {
  background-color: var(--application-sidebar-background-color);
  padding: 20px 10px;
  border-right: var(--gray5-color) 1px solid;
}

.application-sidebar-header {
  line-height: 1em;
  font-weight: 600;
}

.application-sidebar-header > label {
  color: var(--application-sidebar-header-font-color);
}

.application-sidebar-content + .application-sidebar-header {
  margin-top: 30px;
}

.application-sidebar-item {
  display: grid;
  grid-template-columns: 1em 1fr;
  gap: 8px;
  padding: 10px;
  line-height: 1em;
  border-radius: 5px;
  text-decoration: none;
}

.application-sidebar-item > * {
  cursor: pointer;
}

.application-sidebar-item:hover:not(.nuxt-link-exact-active) > * {
  opacity: 0.5;
}

.application-sidebar-item > label {
  margin: 0;
}

.application-sidebar-item + .application-sidebar-item {
  margin-top: 8px;
}

.nuxt-link-exact-active {
  background-color: var(--application-sidebar-active-link-background-color);
}
</style>

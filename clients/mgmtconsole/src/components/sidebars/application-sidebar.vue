<template>
  <div class="sidebar">
    <section class="sidebar-section">
      <label class="system-headline-font sidebar-header">{{
        $t('StrOverview')
      }}</label>
      <div class="sidebar-item-container">
        <n-link
          :to="createApplicationNuxtLink('statistics')"
          class="sidebar-item"
        >
          <Icon icon="chart-bar" />
          <label>{{ $t('StrStatistics') }}</label>
        </n-link>
        <n-link :to="createApplicationNuxtLink('status')" class="sidebar-item">
          <Icon icon="heart-monitor" />
          <label>{{ $t('StrStatus') }}</label>
        </n-link>
      </div>
    </section>

    <section class="sidebar-section">
      <label class="system-headline-font sidebar-header">{{
        $t('StrApplicationSettings')
      }}</label>
      <div class="sidebar-item-container">
        <n-link :to="createApplicationNuxtLink('general')" class="sidebar-item">
          <Icon icon="gear" />
          <label>{{ $t('StrGeneral') }}</label>
        </n-link>
        <n-link :to="createApplicationNuxtLink('team')" class="sidebar-item">
          <Icon icon="team" />
          <label>{{ $t('StrTeam') }}</label>
        </n-link>
        <n-link
          :to="createApplicationNuxtLink('authentication')"
          class="sidebar-item"
        >
          <Icon icon="user-circle" />
          <label>{{ $t('StrAuthentication') }}</label>
        </n-link>
        <n-link
          :to="createApplicationNuxtLink('database')"
          class="sidebar-item"
        >
          <Icon icon="ssd" />
          <label>{{ $t('StrDatabase') }}</label>
        </n-link>
        <n-link
          :to="createApplicationNuxtLink('pushnotifications')"
          class="sidebar-item"
        >
          <Icon icon="chat" />
          <label>{{ $t('StrPushNotifications') }}</label>
        </n-link>
        <n-link :to="createApplicationNuxtLink('ads')" class="sidebar-item">
          <Icon icon="ads" />
          <label>{{ $t('StrAds') }}</label>
        </n-link>
        <n-link
          :to="createApplicationNuxtLink('filestorage')"
          class="sidebar-item"
        >
          <Icon icon="file" />
          <label>{{ $t('StrFileStorage') }}</label>
        </n-link>
        <n-link :to="createApplicationNuxtLink('hosting')" class="sidebar-item">
          <Icon icon="globe" />
          <label>{{ $t('StrHosting') }}</label>
        </n-link>
        <n-link
          :to="createApplicationNuxtLink('security-and-privacy')"
          class="sidebar-item"
        >
          <Icon icon="lock" />
          <label>{{ $t('StrSecurityAndPrivacy') }}</label>
        </n-link>
      </div>
    </section>
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

<style src="~/assets/styles/components/sidebar.css" scoped></style>

<template>
  <Sidebar>
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
      <div class="sidebar-item-container">
        <n-link
          :to="createApplicationNuxtLink('invoices')"
          @click.native="onSidebarLinkClicked"
          class="sidebar-item"
          :class="$mq"
        >
          <Icon icon="invoice" />
          <label>{{ $t('StrInvoices') }}</label>
        </n-link>
      </div>
    </section>
  </Sidebar>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationSidebar extends Vue {
  protected createApplicationNuxtLink(urlPath: string) {
    return `/application/${urlPath}/${this.$route.params.id}`;
  }

  protected onSidebarLinkClicked() {
    this.$nuxt.$emit('hide-sidebar');
  }
}
</script>

<style scoped></style>

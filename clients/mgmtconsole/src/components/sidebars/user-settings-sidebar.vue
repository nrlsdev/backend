<template>
  <Sidebar>
    <section class="sidebar-section" :class="$mq">
      <label class="system-headline-font sidebar-header">{{
        $t('StrUserSettings')
      }}</label>
      <div class="sidebar-item-container">
        <n-link
          :to="createApplicationNuxtLink('general')"
          @click.native="onSidebarLinkClicked"
          class="sidebar-item"
          :class="$mq"
        >
          <Icon icon="chart-bar" />
          <label>{{ $t('StrGeneral') }}</label>
        </n-link>
        <n-link
          :to="createApplicationNuxtLink('payment')"
          @click.native="onSidebarLinkClicked"
          class="sidebar-item"
          :class="$mq"
        >
          <Icon icon="credit-card" />
          <label>{{ $t('StrPaymentInformation') }}</label>
        </n-link>
      </div>
    </section>
  </Sidebar>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class UserSettingsSidebar extends Vue {
  protected createApplicationNuxtLink(urlPath: string) {
    return `/user/settings/${urlPath}`;
  }

  protected onSidebarLinkClicked() {
    this.$nuxt.$emit('hide-sidebar');
  }
}
</script>

<style scoped></style>

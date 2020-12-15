<template>
  <div>
    <div class="application-overview-header">
      <h1 class="system-large-title-font">{{ $t('StrApplications') }}</h1>
      <Icon
        @click.native="onCreateApplicationClicked"
        class="application-overview-icon"
        icon="plus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class IndexPage extends Vue {
  protected onCreateApplicationClicked() {}
}
</script>

<style scoped>
.application-overview-header {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 20px;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--applications-overview-header-border-line-color);
}

.application-overview-icon {
  width: 2em;
  height: 2em;
  fill: var(--default-icon-color);
  cursor: pointer;
}

.application-overview-icon:hover {
  fill: var(--default-icon-hover-color);
}
</style>

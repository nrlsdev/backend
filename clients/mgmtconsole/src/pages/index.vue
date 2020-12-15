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
    <Modal
      id="application-overview-modal"
      :title="$t('StrCreateApplication')"
      positiveBtnText="StrCreate"
      :positiveBtnClickHandler="onCreateApplicationBtnClicked"
    >
      <div class="application-overview-modal-input">
        <CustomInput
          type="text"
          :placeholder="$t('StrApplicationBundleIdentifier')"
          v-model="createApplicationBundleId"
        />
        <CustomInput
          type="text"
          :placeholder="$t('StrApplicationName')"
          v-model="createApplicationName"
        />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class IndexPage extends Vue {
  protected createApplicationBundleId: string = '';

  protected createApplicationName: string = '';

  protected showCreateApplicationsModal: boolean = false;

  protected onCreateApplicationClicked() {
    this.$root.$emit('bv::show::modal', 'application-overview-modal');
  }

  protected onCreateApplicationBtnClicked() {
    console.log({
      bundleId: this.createApplicationBundleId,
      name: this.createApplicationName,
    });
    console.log('Not implemented yet!');
  }
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

.application-overview-modal-input {
  display: grid;
  grid-template-rows: auto;
  gap: 8px;
}
</style>

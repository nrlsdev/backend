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
      :id="applicationOverviewModalId"
      :title="$t('StrCreateApplication')"
      positiveBtnText="StrCreate"
      :positiveBtnClickHandler="onCreateApplicationBtnClicked"
      :error="createApplicationError"
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
    <div class="common-wrapper application-overview-container" :class="$mq">
      <Application
        v-for="application in applications"
        :key="application.bundleId"
        :application="application"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import {
  ApplicationData,
  ApplicationModule,
} from '../store/modules/application';

@Component
export default class IndexPage extends Vue {
  private applicationOverviewModalId: string = 'application-overview-modal';

  protected createApplicationBundleId: string = '';

  protected createApplicationName: string = '';

  protected showCreateApplicationsModal: boolean = false;

  protected createApplicationError: string = '';

  protected applications: ApplicationData[] = [];

  protected async fetch() {
    if (ApplicationModule.applications.length <= 0) {
      await ApplicationModule.loadApplications();
    }

    this.applications = ApplicationModule.applications;
  }

  protected onCreateApplicationClicked() {
    this.$root.$emit('bv::show::modal', 'application-overview-modal');
  }

  protected async onCreateApplicationBtnClicked() {
    const error = await ApplicationModule.createApplication({
      bundleId: this.createApplicationBundleId,
      name: this.createApplicationName,
    });

    if (error) {
      this.createApplicationError = error;
      return;
    }

    this.$root.$emit('bv::hide::modal', this.applicationOverviewModalId);
  }
}
</script>

<style lang="postcss" scoped>
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

.application-overview-container {
  display: grid;
  gap: 40px;
  text-align: center;
  &.xs,
  &.sm {
    grid-template-columns: repeat(2, 1fr);
  }
  &.md {
    grid-template-columns: repeat(3, 1fr);
  }
  &.lg,
  &.xl {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

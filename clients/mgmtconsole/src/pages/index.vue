<template>
  <div>
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
    <div class="common-wrapper">
      <div class="application-overview-header">
        <h1 class="system-large-title-font">{{ $t('StrApplications') }}</h1>
        <CustomButton
          class="default application-overview-add-button"
          @click.native="onCreateApplicationClicked"
        >
          <Icon class="application-overview-icon" icon="plus" />
          Add Application
        </CustomButton>
      </div>
      <div class="application-overview-container" :class="$mq">
        <Application
          v-for="application in applications"
          :key="application.bundleId"
          :application="application"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Modal from '../components/elements/modal.vue';
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
    await ApplicationModule.loadApplications();

    this.applications = ApplicationModule.applications;
  }

  protected onCreateApplicationClicked() {
    Modal.setVisible(this.$root, this.applicationOverviewModalId, true);
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

    Modal.setVisible(this.$root, this.applicationOverviewModalId, false);
  }
}
</script>

<style lang="postcss" scoped>
.application-overview-header {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
}

.application-overview-add-button {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.application-overview-icon {
  width: 1em;
  height: 1em;
  fill: var(--default-icon-color);
}

.application-overview-icon:hover {
  fill: var(--default-icon-hover-color);
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

.application-overview-modal-input {
  display: grid;
  grid-template-rows: auto;
  gap: 8px;
}
</style>

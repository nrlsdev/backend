<template>
  <div class="common-wrapper">
    <PageHeader
      title="StrApplications"
      buttonText="StrCreateApplication"
      mobileIcon="plus"
      :onActionButtonClicked="onCreateApplicationClicked"
    />
    <div class="applications-overview-container" :class="$mq">
      <Application
        v-for="application in applications"
        :key="application.bundleId"
        :application="application"
      />
    </div>
    <Modal
      :id="applicationOverviewModalId"
      :title="$t('StrCreateApplication')"
      positiveBtnText="StrCreate"
      :positiveBtnClickHandler="onCreateApplicationBtnClicked"
      :error="createApplicationError"
    >
      <div class="applications-overview-modal-input">
        <CustomInput
          class="block"
          type="text"
          :placeholder="$t('StrApplicationBundleIdentifier')"
          v-model="createApplicationBundleId"
        />
        <CustomInput
          class="block"
          type="text"
          :placeholder="$t('StrApplicationName')"
          v-model="createApplicationName"
        />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Application } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import Modal from '../components/elements/modal.vue';
import { ApplicationModule } from '../store/modules/application';

@Component
export default class IndexPage extends Vue {
  private applicationOverviewModalId: string = 'application-overview-modal';

  protected createApplicationBundleId: string = '';

  protected createApplicationName: string = '';

  protected showCreateApplicationsModal: boolean = false;

  protected createApplicationError: string = '';

  protected applications: Application[] = [];

  protected async fetch() {
    await this.loadApplications();
  }

  protected async loadApplications() {
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
      return false;
    }

    await this.loadApplications();

    return true;
  }
}
</script>

<style lang="postcss" scoped>
.applications-overview-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 25px;
  align-items: center;
}

.applications-overview-container {
  display: grid;
  gap: 50px;
  &.sm {
    grid-template-columns: repeat(2, 1fr);
  }
  &.md,
  &.lg {
    grid-template-columns: repeat(4, 1fr);
  }
}

.applications-overview-modal-input {
  display: grid;
  grid-template-rows: auto;
  gap: 16px;
}
</style>

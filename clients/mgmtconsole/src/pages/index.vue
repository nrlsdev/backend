<template>
  <div class="common-wrapper">
    <div class="page-header applications-overview-header">
      <h1 class="system-large-title-font">{{ $t('StrApplications') }}</h1>
      <div>
        <CustomButton
          class="block default"
          @click.native="onCreateApplicationClicked"
          >{{ $t('StrCreateApplication') }}</CustomButton
        >
      </div>
    </div>
    <div class="applications-overview-container">
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
          class="borderless"
          type="text"
          :placeholder="$t('StrApplicationBundleIdentifier')"
          v-model="createApplicationBundleId"
        />
        <CustomInput
          class="borderless"
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
      return;
    }
    await this.loadApplications();
    Modal.setVisible(this.$root, this.applicationOverviewModalId, false);
  }
}
</script>

<style scoped>
.applications-overview-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 25px;
  align-items: center;
}

.applications-overview-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
}

.applications-overview-modal-input {
  display: grid;
  grid-template-rows: auto;
  gap: 8px;
}
</style>

<template>
  <div v-if="application">
    <h1 class="system-large-title-font">{{ $t('StrGeneral') }}</h1>
    <section class="application-section">
      <div>
        <h2 class="system-title-two-font">{{ $t('StrInfo') }}</h2>
      </div>
      <div class="application-general-info-container">
        <img
          class="application-general-image"
          src="/application-placeholder.png"
        />
        <div>
          <CustomInput
            class="block readonly"
            type="text"
            :value="application.bundleId"
            readonly
          />
          <CustomInput class="block" type="text" :value="application.name" />
        </div>
      </div>
      <div class="application-change-actions">
        <CustomButton class="default">{{ $t('StrCancel') }}</CustomButton>
        <CustomButton class="branded">{{ $t('StrSave') }}</CustomButton>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import { ApplicationData } from '../../../../store/modules/application';

@Component
export default class ApplicationGeneralPage extends Vue {
  protected applicationId: string = '';

  protected application: ApplicationData | null = null;

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    await this.loadApplication();
  }

  protected async loadApplication() {
    this.application = await getApplicationById(this.applicationId);
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>

<style scoped>
.application-general-info-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
}

.application-general-image {
  width: 128px;
  height: 128px;
}

.application-change-actions {
  margin-left: auto;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-column: span 2;
  gap: 20px;
}
</style>

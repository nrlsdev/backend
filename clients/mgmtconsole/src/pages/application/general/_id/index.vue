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
          <input
            class="todo-input readonly"
            type="text"
            :value="application.bundleId"
            readonly
          />
          <input class="todo-input" type="text" :value="application.name" />
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
import { Application } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';

@Component
export default class ApplicationGeneralPage extends Vue {
  protected applicationId!: string;

  protected application!: Application;

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

.todo-input {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid var(--gray5-color);
  border-radius: 5px;
  background-color: var(--gray6-color);
  color: var(--white);
}

.todo-input + .todo-input {
  margin-top: 20px;
}

.readonly {
  color: var(--gray3-color);
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

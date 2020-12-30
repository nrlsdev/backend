<template>
  <div v-if="application">
    <h1 class="system-large-title-font">{{ $t('StrGeneral') }}</h1>
    <section class="application-section">
      <div>
        <h2 class="system-title-two-font">{{ $t('StrInfo') }}</h2>
      </div>
      <div class="application-general-info-container">
        <div @click="onImagePickerClicked">
          <input
            class="application-general-image-picker"
            type="file"
            accept="image/*"
            ref="applicationGeneralImagePicker"
            @change="onApplicationImageSelected"
          />
          <img
            class="application-general-image"
            :src="
              application.image
                ? application.image
                : '/application-placeholder.png'
            "
            ref="applicationGeneralImage"
          />
          <div class="application-general-image-edit-container">
            <Icon class="application-general-image-edit-icon" icon="pencil" />
          </div>
        </div>
        <div>
          <CustomInput
            class="block readonly"
            type="text"
            :value="application.bundleId"
            readonly
          />
          <CustomInput class="block" type="text" v-model="application.name" />
        </div>
      </div>
      <ApplicationChangeActions
        v-model="ShowGeneralInfoChangeActions"
        :onSaveBtnClicked="onInfoSectionSaveBtnClicked"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import {
  Application,
  objectEquals,
  copyObject,
} from '@backend/systeminterfaces';
import { updateGeneralInfo } from '../../../../api/application/general';

@Component
export default class ApplicationGeneralPage extends Vue {
  protected applicationId: string = '';

  protected originalApplication: Application | null = null;

  protected application: Application | null = null;

  // view state
  protected showGeneralInfoChangeActions: boolean = false;

  protected get ShowGeneralInfoChangeActions() {
    return (
      this.showGeneralInfoChangeActions ||
      !objectEquals(this.application, this.originalApplication)
    );
  }

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    await this.loadApplication();
  }

  protected async loadApplication() {
    this.originalApplication = await getApplicationById(this.applicationId);

    if (this.originalApplication) {
      this.application = copyObject(this.originalApplication);
    }

    this.showGeneralInfoChangeActions = false;
  }

  // image picker
  protected getImagePicker() {
    const imagePicker = this.$refs
      .applicationGeneralImagePicker as HTMLInputElement;
    if (!(imagePicker instanceof HTMLInputElement)) {
      return null;
    }
    return imagePicker;
  }

  protected onImagePickerClicked() {
    const imagePicker = this.getImagePicker();

    if (!imagePicker) {
      return;
    }

    imagePicker.click();
  }

  protected onApplicationImageSelected() {
    const imagePicker = this.getImagePicker();

    if (!imagePicker) {
      return;
    }

    const { files } = imagePicker;

    if (!files || files.length <= 0) {
      return;
    }

    const imgElement = this.$refs.applicationGeneralImage as HTMLImageElement;
    const image = files[0];

    imgElement.src = URL.createObjectURL(image);

    this.showGeneralInfoChangeActions = true;
  }

  // general info
  protected async onInfoSectionSaveBtnClicked() {
    const error = await updateGeneralInfo(this.applicationId, this.application);

    if (error) {
      console.log(error); // ToDo show error
      return;
    }

    this.loadApplication();
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

.application-general-info-container > div:first-of-type {
  height: 128px;
}

.application-general-image-picker {
  display: none;
}

.application-general-image {
  width: 128px;
  height: 128px;
}

.application-general-image-edit-container {
  top: -128px;
  padding: 32px;
  position: relative;
  background-color: var(--transparent-color);
  fill: var(--transparent-color);
  transition: 0.25s ease;
}

.application-general-image-edit-container:hover {
  background-color: var(--transparent50-color);
  display: inherit;
  transition: 0.25s ease;
}

.application-general-image-edit-container:hover
  > .application-general-image-edit-icon {
  fill: var(--white-color);
}

.application-general-image-edit-icon {
  width: 64px;
  height: 64px;
  background-color: var(--transparent-color);
  fill: var(--transparent-color);
}
</style>

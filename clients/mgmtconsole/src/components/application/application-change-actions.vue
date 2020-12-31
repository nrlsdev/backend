<template>
  <div class="application-change-actions" v-if="value">
    <span class="system-error-font">{{ error }}</span>
    <CustomButton
      class="application-change-action-button-group default"
      @click.native="onCancelBtnClicked"
      >{{ $t('StrCancel') }}</CustomButton
    >
    <CustomButton
      class="application-change-action-button-group branded"
      @click.native="onSaveBtnClicked"
      >{{ $t('StrSave') }}</CustomButton
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ApplicationChangeActions extends Vue {
  @Prop({ required: false, type: String })
  protected error: string = '';

  @Prop({})
  protected value!: boolean;

  @Prop({ required: true, type: Function })
  protected onSaveBtnClicked!: Function;

  protected onCancelBtnClicked() {
    this.$router.go(0); // ToDo
  }
}
</script>

<style scoped>
.application-change-actions {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 20px;
  justify-content: end;
  align-items: start;
  text-align: right;
}
</style>

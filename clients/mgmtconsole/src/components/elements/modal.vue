<template>
  <b-modal :id="id" :title="title" hide-footer centered>
    <slot />
    <div>
      <label class="modal-error">{{ error }}</label>
    </div>
    <div class="modal-footer-container">
      <CustomButton
        class="modal-btn"
        @click.native="
          negativeBtnClickHandler
            ? negativeBtnClickHandler()
            : defaultNegativeBtnClickHandler()
        "
        >{{ $t(negativeBtnText) }}</CustomButton
      >

      <CustomButton
        class="branded"
        @click.native="
          positiveBtnClickHandler
            ? positiveBtnClickHandler()
            : defaultPositiveBtnClickHandler()
        "
        >{{ $t(positiveBtnText) }}</CustomButton
      >
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Modal extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  protected id!: string;

  @Prop({
    type: String,
    required: true,
  })
  protected title!: string;

  @Prop({
    type: String,
    required: false,
    default: 'StrDone',
  })
  protected positiveBtnText!: string;

  @Prop({
    type: Function,
    required: false,
    default: undefined,
  })
  protected positiveBtnClickHandler!: Function;

  @Prop({
    type: String,
    required: false,
    default: 'StrCancel',
  })
  protected negativeBtnText!: string;

  @Prop({
    type: Function,
    required: false,
    default: undefined,
  })
  protected negativeBtnClickHandler!: Function;

  @Prop({
    type: String,
    required: false,
  })
  protected error!: string;

  protected defaultPositiveBtnClickHandler() {}

  protected defaultNegativeBtnClickHandler() {
    this.$root.$emit('bv::hide::modal', this.id);
  }
}
</script>

<style scoped>
.modal-footer-container {
  margin-top: 16px;
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px;
}

.modal-error {
  color: var(--error-message-color);
}

/* modal header */
::v-deep .modal-header {
  border-color: var(--modal-header-border-color);
}

/* modal content */
::v-deep .modal-content {
  background-color: var(--modal-background-color);
}

/* modal close button in header */
::v-deep .close {
  display: none;
}
</style>

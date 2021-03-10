<template>
  <b-modal :id="id" :title="title" hide-footer centered :size="size">
    <slot />
    <div>
      <span class="modal-error" v-if="error">{{ error }}</span>
    </div>
    <div
      :class="
        hidePositiveButton
          ? 'modal-footer-container-1'
          : 'modal-footer-container-2'
      "
    >
      <CustomButton
        class="modal-btn"
        @click.native="defaultNegativeBtnClickHandler()"
        >{{ $t(negativeBtnText) }}</CustomButton
      >
      <CustomButton
        :class="isDeleteModal ? 'delete' : 'branded'"
        @click.native="defaultPositiveBtnClickHandler()"
        v-if="isDeleteModal && !hidePositiveButton"
        >{{ $t(isDeleteModal ? 'StrDelete' : positiveBtnText) }}</CustomButton
      >
      <CustomButton
        :class="danger ? 'delete' : 'branded'"
        @click.native="defaultPositiveBtnClickHandler()"
        v-else
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

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected isDeleteModal!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected danger!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected hidePositiveButton!: boolean;

  @Prop({
    type: String,
    required: false,
    default: 'md',
  })
  protected size!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected scrollable!: boolean;

  protected async defaultPositiveBtnClickHandler() {
    const close: boolean = this.positiveBtnClickHandler
      ? (await this.positiveBtnClickHandler()) || false
      : false;

    if (close) {
      Modal.setVisible(this.$root, this.id, false);
    }
  }

  protected async defaultNegativeBtnClickHandler() {
    const close: boolean = this.negativeBtnClickHandler
      ? (await this.negativeBtnClickHandler()) || true
      : true;

    if (close) {
      Modal.setVisible(this.$root, this.id, false);
    }
  }

  public static setVisible(vue: Vue, id: string, visibile: boolean) {
    if (visibile) {
      vue.$root.$emit('bv::show::modal', id);
    } else {
      vue.$root.$emit('bv::hide::modal', id);
    }
  }
}
</script>

<style scoped>
.modal-footer-container-1 {
  margin-top: 32px !important;
  display: grid;
  grid-template-columns: auto;
  gap: 8px;
}

.modal-footer-container-2 {
  margin-top: 32px !important;
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px;
}

.modal-error {
  margin-top: 16px;
  display: block;
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

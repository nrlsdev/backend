<template>
  <Modal
    :id="id"
    :title="$t('StrChangePaymentMethod')"
    :error="error"
    positiveBtnText="StrOk"
    :positiveBtnClickHandler="
      onPositiveButtonClicked === undefined
        ? onDefaultPositiveButtonClicked
        : onPositiveButtonClicked
    "
    size="xl"
  >
    <div
      class="payment-information-modal-container"
      :class="$mq"
      v-if="selectedPaymentInformation"
    >
      <PaymentInformationCard
        v-for="paymentInformation in paymentInformations"
        :key="paymentInformation.card.id"
        :class="
          paymentInformation.card.id === selectedPaymentInformation.card.id
            ? 'selected-element'
            : 'not-selected-element'
        "
        :paymentInformation="paymentInformation"
        @click.native="onPaymentInformationClicked(paymentInformation)"
      />
    </div>
  </Modal>
</template>

<script lang="ts">
import { PaymentInformation } from '@backend/systeminterfaces';
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { getPaymentInformations } from '../../api/system-user/payment-information';

@Component
export default class ChangePaymentInformationModal extends Vue {
  @Prop()
  protected value!: any;

  @Prop({
    type: String,
    required: true,
  })
  protected id!: string;

  @Prop({
    type: String,
    required: false,
  })
  protected error!: string;

  @Prop({
    type: Function,
    required: false,
  })
  protected onPositiveButtonClicked!: Function;

  @Prop({
    type: String,
    required: false,
  })
  protected firstSelectedPaymentInformationId!: string;

  protected paymentInformations: PaymentInformation[] = [];

  protected selectedPaymentInformation: PaymentInformation | null = null;

  protected async fetch() {
    await this.loadPaymentInformations();
  }

  protected async loadPaymentInformations() {
    const result = await getPaymentInformations();

    if (result.error || !result.paymentInformations) {
      // ToDo: Error handling
      return;
    }

    this.paymentInformations = result.paymentInformations;
    this.setSelectedPaymentInformation(
      this.paymentInformations.filter(
        (paymentInfomrtaion: PaymentInformation) => {
          if (this.firstSelectedPaymentInformationId) {
            return (
              paymentInfomrtaion.card!.id ===
              this.firstSelectedPaymentInformationId
            );
          } else {
            return paymentInfomrtaion.card!.default;
          }
        },
      )[0],
    );
  }

  protected onDefaultPositiveButtonClicked() {
    return true;
  }

  protected onPaymentInformationClicked(
    paymentInformation: PaymentInformation,
  ) {
    this.setSelectedPaymentInformation(paymentInformation);
  }

  protected setSelectedPaymentInformation(
    paymentInformation: PaymentInformation,
  ) {
    this.selectedPaymentInformation = paymentInformation;
    this.$emit('input', this.selectedPaymentInformation);
  }
}
</script>

<style lang="postcss" scoped>
.payment-information-modal-container {
  display: grid;
  &.sm,
  &.md {
    grid-template-columns: 1fr;
  }
  &.lg {
    grid-template-columns: repeat(2, 1fr);
  }
  gap: 20px;
}

.not-selected-element {
  border: 1px solid var(--gray6-color);
}

.selected-element {
  border: 1px solid var(--primary-color);
}
</style>

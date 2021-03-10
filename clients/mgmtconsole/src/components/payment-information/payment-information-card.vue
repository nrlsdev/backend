<template>
  <div class="payment-information-item">
    <div class="payment-information-item-header">
      <Icon
        class="payment-information-item-card-icon"
        :icon="paymentInformation.card.brand.toLowerCase()"
      />
      <strong v-if="$mq !== 'sm'"
        >**** **** **** {{ paymentInformation.card.last4 }}
      </strong>
      <strong v-else>&hellip; {{ paymentInformation.card.last4 }}</strong>
      <CustomButton
        class="block delete"
        mobileIcon="trash"
        @click.native="
          onDeletePaymentInformationButtonClicked(paymentInformation.card.id)
        "
        v-if="onDeletePaymentInformationButtonClicked"
        >{{ $t('StrDelete') }}</CustomButton
      >
    </div>
    <div class="payment-information-item-row" :class="$mq">
      <label class="payment-information-item-label" :class="$mq">{{
        $t('StrCardProvider')
      }}</label>
      <label>{{ paymentInformation.card.brand }}</label>
      <label class="payment-information-item-label" :class="$mq">{{
        $t('StrCardOwner')
      }}</label>
      <label>{{ paymentInformation.card.owner }}</label>
      <label class="payment-information-item-label" :class="$mq">{{
        $t('StrExpirationDate')
      }}</label>
      <label
        >{{ paymentInformation.card.expirationMonth }} /
        {{ paymentInformation.card.expirationYear }}</label
      >
      <label class="payment-information-item-label" :class="$mq">{{
        $t('StrBillingAddress')
      }}</label>
      <p>
        {{ paymentInformation.billingAddress.addressLineOne }}<br />
        {{ paymentInformation.billingAddress.addressLineTwo
        }}<br v-if="paymentInformation.billingAddress.addressLineTwo" />
        <span
          >{{ paymentInformation.billingAddress.zipCode }}
          {{ paymentInformation.billingAddress.city }}</span
        ><br />
        {{ paymentInformation.billingAddress.stateRegionProvince }}<br />
        {{ paymentInformation.billingAddress.country }}
      </p>
    </div>
    <CustomButton
      class="block default payment-information-set-as-default-button"
      @click.native="onUseAsDefaultButtonClicked(paymentInformation.card.id)"
      v-if="onUseAsDefaultButtonClicked && !paymentInformation.card.default"
    >
      {{ $t('StrUseAsDefault') }}
    </CustomButton>
    <CustomButton
      class="block payment-information-set-as-default-button"
      readonly
      v-else-if="onUseAsDefaultButtonClicked && paymentInformation.card.default"
    >
      {{ $t('StrDefaultPaymentInformation') }}
    </CustomButton>
  </div>
</template>

<script lang="ts">
import { PaymentInformation } from '@backend/systeminterfaces';
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class PaymentInformationCard extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  protected paymentInformation!: PaymentInformation;

  @Prop({
    type: Function,
    required: false,
  })
  protected onDeletePaymentInformationButtonClicked!: Function;

  @Prop({
    type: Function,
    required: false,
  })
  protected onUseAsDefaultButtonClicked!: Function;
}
</script>

<style lang="postcss" scoped>
.payment-information-item {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--gray6-color);
}

.payment-information-item-header {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
}

.payment-information-item-card-icon {
  width: 2em;
  height: 2em;
}

.payment-information-item-row {
  display: grid;
  &.sm {
    grid-template-columns: 1fr;
  }
  &.md,
  &.lg {
    grid-template-columns: auto 1fr;
    grid-row-gap: 16px;
  }
  grid-column-gap: 20px;
  align-items: top;
}

.payment-information-item-label {
  display: block;
  color: var(--gray1-color);
}

* + .payment-information-item-label {
  &.sm {
    margin-top: 16px !important;
  }
}

.payment-information-set-as-default-button {
  margin-top: 20px;
}
</style>

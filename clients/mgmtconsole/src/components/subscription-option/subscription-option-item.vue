<template>
  <div class="subscription-option-item">
    <div class="subscription-option-item-header">
      <strong class="system-title-two-font">{{
        $t(subscriptionOption.name)
      }}</strong>
      <label class="system-title-two-font" v-if="!hidePrice"
        >{{
          toLocalizedPriceString(
            showPricesYearly
              ? subscriptionOption.priceYear
              : subscriptionOption.priceMonth,
          )
        }}
        / {{ $t(showPricesYearly ? 'StrYear' : 'StrMonth') }}</label
      >
    </div>
    <div class="subscription-option-item-row" :class="$mq">
      <label class="subscription-option-item-label" :class="$mq">{{
        $t('StrReadRequests')
      }}</label>
      <label>{{ subscriptionOption.readRequests }}</label>
      <label class="subscription-option-item-label" :class="$mq">{{
        $t('StrWriteRequests')
      }}</label>
      <label>{{ subscriptionOption.writeRequests }}</label>
      <label class="subscription-option-item-label" :class="$mq">{{
        $t('StrDataStorage')
      }}</label>
      <label>{{ subscriptionOption.dataStorageInGB }} GB</label>
    </div>
    <div
      class="subscription-option-item-row subscription-option-item-active"
      :class="$mq"
      v-if="onCancelSubscriptionButtonClicked"
    >
      <label class="subscription-option-item-label" :class="$mq">{{
        $t('StrStartedOn')
      }}</label>
      <label>{{
        toMediumLocalizedDateString(subscriptionOption.startDate)
      }}</label>
      <label
        class="subscription-option-item-label"
        :class="$mq"
        v-if="subscriptionOption.cancelAt === -1"
        >{{ $t('StrNextBillingDate') }}</label
      >
      <label v-if="subscriptionOption.cancelAt === -1">{{
        toMediumLocalizedDateString(subscriptionOption.currentPeriodEnd)
      }}</label>
      <label
        class="subscription-option-item-label"
        :class="$mq"
        v-if="subscriptionOption.cancelAt !== -1"
        >{{ $t('StrCancelAt') }}</label
      >
      <label v-if="subscriptionOption.cancelAt !== -1">{{
        toMediumLocalizedDateString(subscriptionOption.cancelAt)
      }}</label>
    </div>

    <CustomButton
      class="block default subscription-option-item-button"
      @click.native="onChangePaymentMethodButtonClicked"
      v-if="onChangePaymentMethodButtonClicked"
      >{{ $t('StrChangePaymentMethod') }}</CustomButton
    >
    <CustomButton
      class="block default subscription-option-item-button"
      @click.native="onCancelSubscriptionButtonClicked"
      v-if="onCancelSubscriptionButtonClicked"
      >{{ $t('StrCancelSubscription') }}</CustomButton
    >
    <CustomButton
      class="block default subscription-option-item-button"
      @click.native="onChangeSubscriptionButtonClicked(subscriptionOption.id)"
      v-if="onChangeSubscriptionButtonClicked"
      >{{ $t('StrChangeSubscription') }}</CustomButton
    >
    <CustomButton
      class="block default subscription-option-item-button"
      @click.native="onChooseOptionButtonClicked(subscriptionOption.id)"
      v-else-if="onChooseOptionButtonClicked"
      >{{ $t('StrChooseOption') }}</CustomButton
    >
  </div>
</template>

<script lang="ts">
import { SubscriptionOption } from '@backend/systeminterfaces';
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import {
  getMediumLocalizedDateString,
  getLocalizedPriceString,
} from '../../utils/helper-methods';

@Component
export default class SubscriptionOptionItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  protected subscriptionOption!: SubscriptionOption;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected showButtons!: boolean;

  @Prop({
    type: Function,
    required: false,
  })
  protected onChangeSubscriptionButtonClicked!: Function;

  @Prop({
    type: Function,
    required: false,
  })
  protected onChooseOptionButtonClicked!: Function;

  @Prop({
    type: Function,
    required: false,
  })
  protected onChangePaymentMethodButtonClicked!: Function;

  @Prop({
    type: Function,
    required: false,
  })
  protected onCancelSubscriptionButtonClicked!: Function;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected hidePrice!: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected showPricesYearly!: boolean;

  protected toMediumLocalizedDateString(milliseconds: number) {
    return getMediumLocalizedDateString(milliseconds, this.$i18n.locale);
  }

  protected toLocalizedPriceString(price: number) {
    return getLocalizedPriceString(price / 100, this.$i18n.locale);
  }
}
</script>

<style lang="postcss" scoped>
.subscription-option-item {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--gray6-color);
}

.subscription-option-item-header {
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  border-bottom: 1px solid var(--gray5-color);
}

.subscription-option-item-row {
  margin-top: 20px;
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

.subscription-option-item-label {
  display: block;
  color: var(--gray1-color);
}

* + .subscription-option-item-label {
  &.sm {
    margin-top: 16px !important;
  }
}

.subscription-option-item-button {
  margin-top: 20px;
}

.subscription-option-item-active {
  padding: 20px;
  border: 1px solid var(--gray4-color);
  border-radius: 10px;
}
</style>

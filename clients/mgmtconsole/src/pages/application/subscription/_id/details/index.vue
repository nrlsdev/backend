<template>
  <div v-if="loadingDone">
    <PageHeader title="StrSubscriptionOverview" />
    <section class="detail-section">
      <div class="detail-section-header">
        <h2 class="system-title-one-font">{{ $t('StrSubscriptionOption') }}</h2>
        <CustomButton
          class="block default"
          mobileIcon="pencil"
          @click.native="onSubscriptionOptionChangeButtonClicked"
          >{{ $t('StrChange') }}</CustomButton
        >
      </div>
      <div class="detail-selected-option-container" :class="$mq">
        <SubscriptionOptionItem
          :subscriptionOption="selectedSubscriptionOption"
          hidePrice
        />
      </div>
    </section>
    <section class="detail-section">
      <div class="detail-section-header">
        <h2 class="system-title-one-font">{{ $t('StrSubscriptionPeriod') }}</h2>
      </div>
      <p>{{ $t('StrSelectTheSubscriptionPeriod') }}</p>
      <div class="detail-selected-option-container" :class="$mq">
        <div
          class="detail-subscription-period-item"
          :class="
            !yearlySubscription ? 'selected-element' : 'not-selected-element'
          "
          @click="onSelectSubscriptionPeriodClicked(false)"
        >
          <label class="system-headline-font">{{ $t('StrMonthly') }}</label>
          <label
            >{{
              toLocalizedPriceString(selectedSubscriptionOption.priceMonth)
            }}
            / {{ $t('StrMonth') }}</label
          >
        </div>
        <div
          class="detail-subscription-period-item"
          :class="
            yearlySubscription ? 'selected-element' : 'not-selected-element'
          "
          @click="onSelectSubscriptionPeriodClicked(true)"
        >
          <label class="system-headline-font">{{ $t('StrYearly') }}</label>
          <label
            >{{
              toLocalizedPriceString(selectedSubscriptionOption.priceYear)
            }}
            / {{ $t('StrYear') }}
          </label>
        </div>
      </div>
    </section>
    <section class="detail-section">
      <div class="detail-section-header">
        <h2 class="system-title-one-font">{{ $t('StrPaymentInformation') }}</h2>
        <CustomButton
          class="block default"
          mobileIcon="plus"
          @click.native="onAddPaymentMethodButtonClicked"
          v-if="selectedPaymentInformation === null"
          >{{ $t('StrAddPaymentInformation') }}</CustomButton
        >
        <CustomButton
          class="block default"
          mobileIcon="pencil"
          @click.native="onChangePaymentMethodButtonClicked"
          v-else
          >{{ $t('StrChange') }}</CustomButton
        >
        <label
          class="system-secondary-font"
          v-if="selectedPaymentInformation === null"
          >{{ $t('StrAddPaymentInformationError') }}</label
        >
      </div>
      <div class="detail-selected-option-container" :class="$mq">
        <PaymentInformationCard
          v-if="selectedPaymentInformation"
          :paymentInformation="selectedPaymentInformation"
        />
      </div>
    </section>
    <section class="detail-section" v-if="selectedPaymentInformation !== null">
      <div class="detail-section-header">
        <h2 class="system-title-one-font">{{ $t('StrSummary') }}</h2>
      </div>
      <div class="detail-invoice-preview-container">
        <div
          class="detail-invoice-preview-item"
          v-for="subscriptionLineItem in subscriptionLineItems"
          :key="subscriptionLineItem.id"
        >
          <label>{{ subscriptionLineItem.description }}</label>
          <label>{{
            toLocalizedPriceString(subscriptionLineItem.amount)
          }}</label>
        </div>
        <div class="detail-invoice-preview-item">
          <label class="system-title-three-font">{{
            $t('StrTotalAmount')
          }}</label>
          <label class="system-title-three-font">{{
            toLocalizedPriceString(totalInvoicePrice)
          }}</label>
        </div>
        <form
          class="detail-promotion-code-form"
          :class="$mq"
          method="POST"
          @submit.prevent="onPromotionCodeButtonClicked"
        >
          <CustomInput
            class="block"
            type="text"
            :placeholder="$t('StrPromotionCode')"
            v-model="promotionCode"
          />
          <CustomButton class="default" type="submit">
            {{ $t('StrRedeem') }}
          </CustomButton>
          <label
            class="system-callout-font system-error-font"
            v-if="promotionCodeEntered && !promotionCodeSuccess"
            >{{ $t('StrInvalidPromotionCode') }}</label
          >
        </form>
      </div>
    </section>
    <div
      :class="
        selectedPaymentInformation == null
          ? 'detail-action-container-1'
          : 'detail-action-container-2'
      "
    >
      <CustomButton
        class="block default"
        @click.native="onCancelButtonClicked"
        >{{ $t('StrCancel') }}</CustomButton
      >
      <CustomButton
        class="block branded"
        @click.native="onChangeButtonClicked"
        v-if="changeSubscription && selectedPaymentInformation !== null"
        >{{ $t('StrChangeSubscription') }}</CustomButton
      >
      <CustomButton
        class="block branded"
        @click.native="onSubscribeButtonClicked"
        v-else-if="selectedPaymentInformation !== null"
        >{{ $t('StrSubscribe') }}</CustomButton
      >
    </div>
    <ChangePaymentInformationModal
      :id="changePaymentMethodModalId"
      :error="changePaymentMethodError"
      v-model="selectedPaymentInformation"
    />
  </div>
</template>

<script lang="ts">
import {
  PaymentInformation,
  SubscriptionLineItem,
  SubscriptionOption,
} from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import {
  getApplicationSubscriptionOptions,
  subscribeApplication,
  changeSubscription,
  getUpcomingSubscriptionInvoice,
} from '../../../../../api/application/subscription/subscription';
import { getLocalizedPriceString } from '../../../../../utils/helper-methods';

@Component
export default class ApplicationSubscriptionDetailsPage extends Vue {
  protected applicationId: string = '';

  protected subscriptionOptionId: number = 0;

  protected changeSubscription: boolean = false;

  protected selectedPaymentInformation: PaymentInformation | null = null;

  protected selectedSubscriptionOption: SubscriptionOption | null = null;

  protected yearlySubscription: boolean = false;

  protected loadingDone: boolean = false;

  protected changePaymentMethodModalId: string = 'change-payment-method-modal';

  protected changePaymentMethodError: string = '';

  protected totalInvoicePrice: number = -1;

  protected subscriptionLineItems: SubscriptionLineItem[] = [];

  protected promotionCode: string = '';

  protected promotionCodeEntered: boolean = false;

  protected promotionCodeSuccess: boolean = false;

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    this.subscriptionOptionId = Number(this.$route.query.option) || 0;
    this.changeSubscription = this.$route.query.change === 'true' || false;

    await this.loadSubsciptionOptions();
    await this.loadUpcomingInvoice();

    this.loadingDone = true;
  }

  protected async loadSubsciptionOptions() {
    const result = await getApplicationSubscriptionOptions(this.applicationId);

    if (result.error || !result.subscriptionOptions) {
      // ToDo: Error handling
      return;
    }

    this.selectedSubscriptionOption = result.subscriptionOptions.filter(
      (subscriptionOption: SubscriptionOption) => {
        return subscriptionOption.id === this.subscriptionOptionId;
      },
    )[0];
  }

  protected async loadUpcomingInvoice() {
    if (!this.selectedSubscriptionOption) {
      return;
    }

    const result = await getUpcomingSubscriptionInvoice(
      this.applicationId,
      this.selectedSubscriptionOption.id,
      this.yearlySubscription,
      this.promotionCode,
    );

    if (this.promotionCode) {
      this.promotionCodeEntered = true;
    }

    if (result.error || !result.total || !result.subscriptionLineItems) {
      // ToDo: Error handling
      return;
    }

    this.totalInvoicePrice = result.total;
    this.subscriptionLineItems = result.subscriptionLineItems;
    this.promotionCodeSuccess = result.promotionCodeSuccess;
  }

  protected onSubscriptionOptionChangeButtonClicked() {
    this.$router.push(`/application/subscription/${this.applicationId}`);
  }

  protected onCancelButtonClicked() {
    this.$router.push(`/application/subscription/${this.applicationId}`);
  }

  protected async onSubscribeButtonClicked() {
    if (
      !this.selectedPaymentInformation ||
      !this.selectedPaymentInformation.card ||
      !this.selectedPaymentInformation.card.id
    ) {
      // ToDo: Error handling
      return;
    }

    const result = await subscribeApplication(
      this.applicationId,
      this.subscriptionOptionId,
      this.yearlySubscription,
      this.selectedPaymentInformation.card.id,
      this.promotionCode,
    );

    if (result.error) {
      // ToDo: Error handling
      return;
    }

    this.$router.push(`/application/subscription/${this.applicationId}`);
  }

  protected async onChangeButtonClicked() {
    if (
      !this.selectedPaymentInformation ||
      !this.selectedPaymentInformation.card ||
      !this.selectedPaymentInformation.card.id
    ) {
      // ToDo: Error handling
      return;
    }

    const result = await changeSubscription(
      this.applicationId,
      this.subscriptionOptionId,
      this.selectedPaymentInformation.card.id,
      this.yearlySubscription,
      this.promotionCode,
    );

    if (result.error) {
      // ToDo: Error handling
      return;
    }

    this.$router.push(`/application/subscription/${this.applicationId}`);
  }

  protected onAddPaymentMethodButtonClicked() {
    this.$router.push('/user/settings/payment');
  }

  protected async onSelectSubscriptionPeriodClicked(
    yearlySubscription: boolean,
  ) {
    this.yearlySubscription = yearlySubscription;

    await this.loadUpcomingInvoice();
  }

  protected toLocalizedPriceString(price: number) {
    return getLocalizedPriceString(price / 100, this.$i18n.locale);
  }

  protected async onPromotionCodeButtonClicked() {
    await this.loadUpcomingInvoice();
  }
}
</script>

<style lang="postcss" scoped>
.detail-section + .detail-section {
  margin-top: 50px;
  padding-top: 50px;
  border-top: 1px solid var(--gray4-color);
}

.detail-section-header {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
}

.detail-selected-option-container {
  display: grid;
  &.sm {
    grid-template-columns: 1fr;
  }
  &.md,
  &.lg {
    grid-template-columns: repeat(2, 1fr);
  }
  gap: 20px;
}

.detail-subscription-period-item {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  border-radius: 10px;
  background-color: var(--gray6-color);
}

.detail-invoice-preview-container {
  display: grid;
  grid-template-columns: auto;
  gap: 20px;
}

.detail-invoice-preview-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
}

.detail-invoice-preview-item > *:nth-child(even) {
  text-align: right;
}

.detail-promotion-code-form {
  &.md,
  &.lg {
    width: calc(50% - 10px);
  }
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 20px;
}

.detail-action-container-1 {
  margin-top: 50px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.detail-action-container-2 {
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
</style>

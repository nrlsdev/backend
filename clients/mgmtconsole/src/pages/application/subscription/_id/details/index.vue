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
          mobileIcon="pencil"
          @click.native="onChangePaymentMethodButtonClicked"
          >{{ $t('StrChange') }}</CustomButton
        >
      </div>
      <div class="detail-selected-option-container" :class="$mq">
        <PaymentInformationCard
          v-if="selectedPaymentInformation"
          :paymentInformation="selectedPaymentInformation"
        />
      </div>
    </section>
    <section class="detail-section">
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
      </div>
    </section>
    <div class="detail-action-container">
      <CustomButton
        class="block default"
        @click.native="onCancelButtonClicked"
        >{{ $t('StrCancel') }}</CustomButton
      >
      <CustomButton
        class="block branded"
        @click.native="onChangeButtonClicked"
        v-if="changeSubscription"
        >{{ $t('StrChange') }}</CustomButton
      >
      <CustomButton
        class="block branded"
        @click.native="onSubscribeButtonClicked"
        v-else
        >{{ $t('StrSubscribe') }}</CustomButton
      >
    </div>
    <Modal
      :id="changePaymentMethodModalId"
      :title="$t('StrChangePaymentMethod')"
      :error="changePaymentMethodError"
      positiveBtnText="StrOk"
      :positiveBtnClickHandler="onChangePaymentMethodModalButtonClicked"
      size="xl"
    >
      <div class="detail-payment-information-modal-container" :class="$mq">
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
import { getPaymentInformations } from '../../../../../api/system-user/payment-information';
import Modal from '../../../../../components/elements/modal.vue';
import { getLocalizedPriceString } from '../../../../../utils/helper-methods';

@Component
export default class ApplicationSubscriptionDetailsPage extends Vue {
  protected applicationId: string = '';

  protected subscriptionOptionId: number = 0;

  protected changeSubscription: boolean = false;

  protected paymentInformations: PaymentInformation[] = [];

  protected selectedPaymentInformation: PaymentInformation | null = null;

  protected selectedSubscriptionOption: SubscriptionOption | null = null;

  protected yearlySubscription: boolean = false;

  protected loadingDone: boolean = false;

  protected changePaymentMethodModalId: string = 'change-payment-method-modal';

  protected changePaymentMethodError: string = '';

  protected totalInvoicePrice: number = -1;

  protected subscriptionLineItems: SubscriptionLineItem[] = [];

  protected async fetch() {
    this.applicationId = this.$route.params.id;
    this.subscriptionOptionId = Number(this.$route.query.option) || 0;
    this.changeSubscription = this.$route.query.change === 'true' || false;

    await this.loadSubsciptionOptions();
    await this.loadPaymentInformations();
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

  protected async loadPaymentInformations() {
    const result = await getPaymentInformations();

    if (result.error || !result.paymentInformations) {
      // ToDo: Error handling
      return;
    }

    this.paymentInformations = result.paymentInformations;
    this.selectedPaymentInformation = this.paymentInformations.filter(
      (paymentInfomrtaion: PaymentInformation) => {
        return paymentInfomrtaion.card!.default;
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
    );

    if (result.error || !result.total || !result.subscriptionLineItems) {
      // ToDo: Error handling
      return;
    }

    this.totalInvoicePrice = result.total;
    this.subscriptionLineItems = result.subscriptionLineItems;
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
    );

    if (result.error) {
      // ToDo: Error handling
      return;
    }

    this.$router.push(`/application/subscription/${this.applicationId}`);
  }

  protected onChangePaymentMethodButtonClicked() {
    Modal.setVisible(this, this.changePaymentMethodModalId, true);
  }

  protected onChangePaymentMethodModalButtonClicked() {
    return true;
  }

  protected onPaymentInformationClicked(
    paymentInformation: PaymentInformation,
  ) {
    this.selectedPaymentInformation = paymentInformation;
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

.detail-action-container {
  margin-top: 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-payment-information-modal-container {
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
</style>

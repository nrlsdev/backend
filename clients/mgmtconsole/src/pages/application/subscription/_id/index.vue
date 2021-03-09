<template>
  <div v-if="loadingDone">
    <PageHeader title="StrSubscription">
      <ToggleSwitch
        :text="$t('StrShowPricesYearly')"
        v-model="showPricesYearly"
      />
    </PageHeader>
    <section
      class="application-subscription-section"
      v-if="activeSubscriptionOption"
    >
      <h2 class="system-title-one-font application-subscription-section-title">
        {{ $t('StrActiveSubscription') }}
      </h2>
      <div class="application-subscription-container" :class="$mq">
        <SubscriptionOptionItem
          :subscriptionOption="activeSubscriptionOption"
          :onCancelSubscriptionButtonClicked="onCancelSubscriptionButtonClicked"
          :onChangePaymentMethodButtonClicked="
            onChangePaymentMethodButtonClicked
          "
          :showPricesYearly="showPricesYearly"
        />
      </div>
    </section>

    <section class="application-subscription-section">
      <h2 class="system-title-one-font">
        {{ $t('StrAvailableSubscriptionOptions') }}
      </h2>
      <div class="application-subscription-container" :class="$mq">
        <SubscriptionOptionItem
          v-for="subscriptionOption in subscriptionOptions"
          :key="subscriptionOption.id"
          :subscriptionOption="subscriptionOption"
          :onChooseOptionButtonClicked="
            activeSubscriptionOption ? undefined : onChooseOptionButtonClicked
          "
          :onChangeSubscriptionButtonClicked="
            activeSubscriptionOption
              ? onChangeSubscriptionButtonClicked
              : undefined
          "
          :showPricesYearly="showPricesYearly"
        />
      </div>
    </section>
    <Modal
      :id="cancelSubscriptionModalId"
      :title="$t('StrCancelSubscription')"
      :error="cancelSubscriptionError"
      positiveBtnText="StrCancelSubscription"
      :positiveBtnClickHandler="onCancelSubscriptionModalButtonClicked"
      danger
    >
      <label>{{ $t('StrCancelSubscriptionInfoText') }}</label>
    </Modal>
    <ChangePaymentInformationModal
      :id="changePaymentMethodModalId"
      :error="changePaymentMethodError"
      :firstSelectedPaymentInformationId="firstSelectedPaymentInformationId"
      :onPositiveButtonClicked="onPaymentMethodChangeModalButtonClicked"
      v-model="selectedPaymentInformation"
    />
  </div>
</template>

<script lang="ts">
import { Application, PaymentInformation } from '@backend/systeminterfaces';
import { SubscriptionOption } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../../../api/application/application';
import {
  cancelSubscription,
  changeApplicationPaymentMethod,
  getApplicationSubscriptionOptions,
} from '../../../../api/application/subscription/subscription';
import Modal from '../../../../components/elements/modal.vue';

@Component
export default class ApplicationSubscriptionPage extends Vue {
  protected cancelSubscriptionModalId: string = 'cancel-subscription-modal';

  protected cancelSubscriptionError: string = '';

  protected applicationId: string = '';

  protected application: Application | null = null;

  protected activeSubscriptionOption: SubscriptionOption | null = null;

  protected subscriptionOptions: SubscriptionOption[] = [];

  protected showPricesYearly: boolean = false;

  protected changePaymentMethodModalId: string = 'change-payment-method-modal';

  protected changePaymentMethodError: string = '';

  protected selectedPaymentInformation: PaymentInformation | null = null;

  protected firstSelectedPaymentInformationId: string = '';

  protected loadingDone: boolean = false;

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    await this.loadData();
  }

  protected async loadData() {
    this.applicationId = this.$route.params.id;

    await this.loadSubscriptionOptions();
    await this.loadApplication();

    this.firstSelectedPaymentInformationId =
      this.activeSubscriptionOption?.defaultCardId || '';

    this.loadingDone = true;
  }

  protected async loadSubscriptionOptions() {
    const result = await getApplicationSubscriptionOptions(this.applicationId);

    if (result.error || !result.subscriptionOptions) {
      // ToDo: Error handling
      return;
    }

    this.subscriptionOptions = result.subscriptionOptions.filter(
      (subscriptionOption: SubscriptionOption) => {
        return !subscriptionOption.active;
      },
    );

    const activeSubscriptions = result.subscriptionOptions.filter(
      (subscriptionOption: SubscriptionOption) => {
        return subscriptionOption.active;
      },
    );

    this.activeSubscriptionOption =
      activeSubscriptions.length > 0 ? activeSubscriptions[0] : null;
  }

  protected async loadApplication() {
    this.application = await getApplicationById(this.applicationId);
  }

  protected onChooseOptionButtonClicked(subscriptionOptionId: string) {
    this.$router.push(
      `/application/subscription/${this.applicationId}/details?option=${subscriptionOptionId}&change=false`,
    );
  }

  protected onChangeSubscriptionButtonClicked(subscriptionOptionId: string) {
    this.$router.push(
      `/application/subscription/${this.applicationId}/details?option=${subscriptionOptionId}&change=true`,
    );
  }

  protected onCancelSubscriptionButtonClicked() {
    Modal.setVisible(this, this.cancelSubscriptionModalId, true);
  }

  protected async onCancelSubscriptionModalButtonClicked() {
    if (
      !this.application ||
      !this.application.subscriptions ||
      !this.application.subscriptions.active ||
      !this.application.subscriptions.active.id
    ) {
      // ToDo: Error handling
      return;
    }

    const result = await cancelSubscription(
      this.applicationId,
      this.application.subscriptions.active.id,
    );

    if (result.error) {
      this.cancelSubscriptionError = result.error;
      return false;
    }

    await this.loadData();

    return true;
  }

  protected onChangePaymentMethodButtonClicked() {
    Modal.setVisible(this, this.changePaymentMethodModalId, true);
  }

  protected async onPaymentMethodChangeModalButtonClicked() {
    if (
      !this.selectedPaymentInformation ||
      !this.selectedPaymentInformation.card ||
      !this.selectedPaymentInformation.card.id
    ) {
      this.changePaymentMethodError = this.$t(
        'StrNoPaymentMethodSelected',
      ).toString();
      return false;
    }

    const result = await changeApplicationPaymentMethod(
      this.applicationId,
      this.selectedPaymentInformation.card.id,
    );

    if (result.error) {
      this.changePaymentMethodError = result.error;
      return false;
    }

    return true;
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>

<style lang="postcss" scoped>
.application-subscription-section + .application-subscription-section {
  margin-top: 100px;
}

.application-subscription-section-title {
  margin-bottom: 20px;
}

.application-subscription-container {
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
</style>

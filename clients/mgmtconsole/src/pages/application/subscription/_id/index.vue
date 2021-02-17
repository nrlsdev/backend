<template>
  <div v-if="loadingDone">
    <PageHeader title="StrSubscription" />
    <section
      class="application-subscription-section"
      v-if="activeSubscriptionOption"
    >
      <h2 class="system-title-two-font application-subscription-section-title">
        {{ $t('StrActiveSubscription') }}
      </h2>
      <div class="application-subscription-container">
        <div class="application-subscription-item">
          <strong class="system-title-three-font">{{
            $t(activeSubscriptionOption.name)
          }}</strong>
          <div class="application-subscription-item-row" :class="$mq">
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrReadRequests')
            }}</label>
            <label>{{ activeSubscriptionOption.readRequests }}</label>
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrWriteRequests')
            }}</label>
            <label>{{ activeSubscriptionOption.writeRequests }}</label>
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrDataStorage')
            }}</label>
            <label>{{ activeSubscriptionOption.dataStorageInGB }} GB</label>
          </div>
          <div
            class="application-subscription-item-row application-subscription-item-active-option"
            :class="$mq"
          >
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrStartedOn')
            }}</label>
            <label>{{ activeSubscriptionOption.startDate }}</label>
            <label
              class="application-subscription-item-label"
              :class="$mq"
              v-if="activeSubscriptionOption.cancelAt === -1"
              >{{ $t('StrNextBillingDate') }}</label
            >
            <label v-if="activeSubscriptionOption.cancelAt === -1">{{
              activeSubscriptionOption.currentPeriodEnd
            }}</label>
            <label
              class="application-subscription-item-label"
              :class="$mq"
              v-if="activeSubscriptionOption.cancelAt !== -1"
              >{{ $t('StrCancelAt') }}</label
            >
            <label v-if="activeSubscriptionOption.cancelAt !== -1">{{
              activeSubscriptionOption.cancelAt
            }}</label>
          </div>
          <CustomButton
            class="block default"
            @click.native="onCancelSubscriptionButtonClicked"
            >{{ $t('StrCancelSubscription') }}</CustomButton
          >
        </div>
      </div>
    </section>

    <section class="application-subscription-section">
      <h2 class="system-title-two-font">
        {{ $t('StrAvailableSubscriptionOptions') }}
      </h2>
      <div class="application-subscription-container">
        <div
          class="application-subscription-item"
          v-for="subscriptionOption in subscriptionOptions"
          :key="subscriptionOption.id"
        >
          <strong class="system-title-three-font">{{
            $t(subscriptionOption.name)
          }}</strong>
          <div class="application-subscription-item-row" :class="$mq">
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrReadRequests')
            }}</label>
            <label>{{ subscriptionOption.readRequests }}</label>
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrWriteRequests')
            }}</label>
            <label>{{ subscriptionOption.writeRequests }}</label>
            <label class="application-subscription-item-label" :class="$mq">{{
              $t('StrDataStorage')
            }}</label>
            <label>{{ subscriptionOption.dataStorageInGB }} GB</label>
          </div>
          <CustomButton
            class="block branded"
            v-if="activeSubscriptionOption"
            @click.native="onChangeSubscriptionButtonClicked"
            >{{ $t('StrChangeSubscription') }}</CustomButton
          >
          <CustomButton
            class="block branded"
            v-else
            @click.native="onSubscribeButtonClicked"
            >{{ $t('StrSubscribe') }}</CustomButton
          >
        </div>
      </div>
    </section>
    <Modal
      :id="subscribeModalId"
      :title="$t('StrSubscribeApplication')"
      :error="subscribeError"
      positiveBtnText="StrSubscribe"
      :positiveBtnClickHandler="onSubscribeModalButtonClicked"
    >
    </Modal>
    <Modal
      :id="changeSubscriptionModalId"
      :title="$t('StrChangeSubscription')"
      :error="changeSubscriptionError"
      positiveBtnText="StrChangeSubscription"
      :positiveBtnClickHandler="onChangeSubscriptionModalButtonClicked"
    >
    </Modal>
    <Modal
      :id="cancelSubscriptionModalId"
      :title="$t('StrCancelSubscription')"
      :error="cancelSubscriptionError"
      positiveBtnText="StrCancelSubscription"
      :positiveBtnClickHandler="onCancelSubscriptionModalButtonClicked"
      isDeleteModal
    >
    </Modal>
  </div>
</template>

<script lang="ts">
import { SubscriptionOption } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationSubscriptionOptions } from '../../../../api/application/subscription';
import Modal from '../../../../components/elements/modal.vue';

@Component
export default class ApplicationSubscriptionPage extends Vue {
  protected subscribeModalId: string = 'subscribe-modal';

  protected subscribeError: string = '';

  protected changeSubscriptionModalId: string = 'change-subscription-modal';

  protected changeSubscriptionError: string = '';

  protected cancelSubscriptionModalId: string = 'cancel-subscription-modal';

  protected cancelSubscriptionError: string = '';

  protected applicationId: string = '';

  protected activeSubscriptionOption: SubscriptionOption | null = null;

  protected subscriptionOptions: SubscriptionOption[] = [];

  protected loadingDone: boolean = false;

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;

    await this.loadSubscriptionOptions();

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

  protected onSubscribeButtonClicked() {
    Modal.setVisible(this, this.subscribeModalId, true);
  }

  protected onSubscribeModalButtonClicked() {
    console.log('Not implemented yet!');
    return true;
  }

  protected onChangeSubscriptionButtonClicked() {
    Modal.setVisible(this, this.changeSubscriptionModalId, true);
  }

  protected onChangeSubscriptionModalButtonClicked() {
    console.log('Not implemented yet!');
    return true;
  }

  protected onCancelSubscriptionButtonClicked() {
    Modal.setVisible(this, this.cancelSubscriptionModalId, true);
  }

  protected onCancelSubscriptionModalButtonClicked() {
    console.log('Not implemented yet!');
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
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.application-subscription-item {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--gray6-color);
}

.application-subscription-item-row {
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

.application-subscription-item-label {
  display: block;
  color: var(--gray1-color);
}

* + .application-subscription-item-label {
  &.sm {
    margin-top: 16px !important;
  }
}

.application-subscription-item-active-option {
  padding: 20px;
  border: 1px solid var(--gray4-color);
  border-radius: 10px;
}
</style>

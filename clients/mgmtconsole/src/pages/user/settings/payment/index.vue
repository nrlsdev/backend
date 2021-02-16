<template>
  <div v-if="loadingDone">
    <PageHeader
      title="StrPaymentInformation"
      buttonText="StrAddPaymentInformation"
      buttonIcon="plus"
      :onActionButtonClicked="onAddPaymentInformationButtonClicked"
    />
    <section class="payment-information-container" :class="$mq">
      <div
        class="payment-information-item"
        v-for="paymentInformation in paymentInformations"
        :key="paymentInformation.card.id"
      >
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
              onDeletePaymentInformationButtonClicked(
                paymentInformation.card.id,
              )
            "
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
          @click.native="
            onUseAsDefaultButtonClicked(paymentInformation.card.id)
          "
          v-if="!paymentInformation.card.default"
        >
          {{ $t('StrUseAsDefault') }}
        </CustomButton>
        <CustomButton
          class="block payment-information-set-as-default-button"
          readonly
          v-else
        >
          {{ $t('StrDefaultPaymentInformation') }}
        </CustomButton>
      </div>
    </section>
    <Modal
      :id="addPaymentnformationModalId"
      :title="$t('StrAddPaymentInformation')"
      positiveBtnText="StrAdd"
      :positiveBtnClickHandler="onAddPaymentInformationModalBtnClicked"
      :error="addPaymentInformationError"
    >
      <CustomInput
        class="block"
        type="number"
        placeholder="StrCreditCardNumber"
        v-model="cardNumber"
      />
      <CustomInput
        class="block"
        type="text"
        placeholder="StrFirstnameAndLastname"
        v-model="cardOwnerName"
      />
      <CustomInput
        class="block"
        type="number"
        placeholder="StrMonth"
        v-model="cardExpirationMonth"
      />
      <CustomInput
        class="block"
        type="number"
        placeholder="StrYear"
        v-model="cardExpirationYear"
      />
      <CustomInput
        class="block"
        type="number"
        placeholder="StrCVC"
        v-model="cardCVC"
      />
      <CustomInput
        class="block"
        type="text"
        placeholder="StrAddressLineOne"
        v-model="addressLineOne"
      />
      <CustomInput
        class="block"
        type="text"
        placeholder="StrAddressLineTwo"
        v-model="addressLineTwo"
      />
      <CustomInput
        class="block"
        type="number"
        placeholder="StrZipCode"
        v-model="addressZipCode"
      />
      <CustomInput
        class="block"
        type="text"
        placeholder="StrCity"
        v-model="addressCity"
      />
      <CustomInput
        class="block"
        type="text"
        placeholder="StrStateRegionProvince"
        v-model="addressStateProvinceRegion"
      />
      <CustomSelect class="block" countries />
    </Modal>
    <Modal
      :id="deletePaymentnformationModalId"
      :title="$t('StrDeletePaymentInformation')"
      :positiveBtnClickHandler="onDeletePaymentInformationModalBtnClicked"
      isDeleteModal
      :error="deletePaymentInformationError"
    >
      <label>{{ $t('StrDeletePaymentInformationInfoText') }}</label>
    </Modal>
  </div>
</template>

<script lang="ts">
import { PaymentInformation } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import {
  addPaymentInformation,
  deletePaymentInformation,
  getPaymentInformations,
  setDefaultPaymentInformation,
} from '../../../../api/system-user/payment-information';
import Modal from '../../../../components/elements/modal.vue';

@Component
export default class UserSettingsPaymentPage extends Vue {
  protected addPaymentnformationModalId: string =
    'add-payment-information-modal';

  protected deletePaymentnformationModalId: string =
    'delete-payment-information-modal';

  protected addPaymentInformationError: string = '';

  protected deletePaymentInformationError: string = '';

  protected loadingDone: boolean = false;

  protected paymentInformations: PaymentInformation[] = [];

  protected currentCardToDelete: string = '';

  protected cardNumber: string = '';

  protected cardOwnerName: string = '';

  protected cardExpirationMonth: string = '';

  protected cardExpirationYear: string = '';

  protected cardCVC: string = '';

  protected addressLineOne: string = '';

  protected addressLineTwo: string = '';

  protected addressZipCode: string = '';

  protected addressCity: string = '';

  protected addressStateProvinceRegion: string = '';

  protected addressCountry: string = '';

  protected cardIdToDelete: string = '';

  protected layout() {
    return 'user-settings';
  }

  protected async fetch() {
    await this.loadPaymentInformations();

    this.loadingDone = true;
  }

  protected async loadPaymentInformations() {
    const result = await getPaymentInformations();

    if (result.error || !result.paymentInformations) {
      // ToDo: Error handling
      return;
    }

    this.paymentInformations = result.paymentInformations;
  }

  protected onAddPaymentInformationButtonClicked() {
    Modal.setVisible(this, this.addPaymentnformationModalId, true);
  }

  protected onDeletePaymentInformationButtonClicked(cardId: string) {
    this.currentCardToDelete = cardId;

    Modal.setVisible(this, this.deletePaymentnformationModalId, true);
  }

  protected async onAddPaymentInformationModalBtnClicked() {
    const result = await addPaymentInformation({
      card: {
        number: this.cardNumber,
        owner: this.cardOwnerName,
        expirationMonth: this.cardExpirationMonth,
        expirationYear: this.cardExpirationYear,
        cvc: this.cardCVC,
      },
      billingAddress: {
        addressLineOne: this.addressLineOne,
        addressLineTwo: this.addressLineTwo,
        zipCode: this.addressZipCode,
        city: this.addressCity,
        stateRegionProvince: this.addressStateProvinceRegion,
        country: this.addressCountry,
      },
    });

    if (result.error) {
      this.addPaymentInformationError = result.error;
      return false;
    }

    await this.loadPaymentInformations();

    return true;
  }

  protected async onDeletePaymentInformationModalBtnClicked() {
    const result = await deletePaymentInformation(this.currentCardToDelete);

    if (result.error) {
      this.deletePaymentInformationError = result.error;
      return false;
    }

    await this.loadPaymentInformations();

    return true;
  }

  protected async onUseAsDefaultButtonClicked(cardId: string) {
    const result = await setDefaultPaymentInformation(cardId);

    if (result.error) {
      // ToDo: Error Handling
      return;
    }

    await this.loadPaymentInformations();
  }
}
</script>

<style lang="postcss" scoped>
.payment-information-container {
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

.payment-information-item-card-icon {
  width: 2em;
  height: 2em;
}

.payment-information-set-as-default-button {
  margin-top: 20px;
}

/* Hide arrows from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>

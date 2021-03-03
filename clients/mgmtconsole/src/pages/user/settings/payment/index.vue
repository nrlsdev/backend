<template>
  <div v-if="loadingDone">
    <PageHeader
      title="StrPaymentInformation"
      buttonText="StrAddPaymentInformation"
      mobileIcon="plus"
      :onActionButtonClicked="onAddPaymentInformationButtonClicked"
    />
    <section class="payment-information-container" :class="$mq">
      <PaymentInformationCard
        v-for="paymentInformation in paymentInformations"
        :key="paymentInformation.card.id"
        :paymentInformation="paymentInformation"
        :onDeletePaymentInformationButtonClicked="
          onDeletePaymentInformationButtonClicked
        "
        :onUseAsDefaultButtonClicked="onUseAsDefaultButtonClicked"
      />
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
      <CustomSelect class="block" countries v-model="addressCountry" />
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

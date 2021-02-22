<template>
  <div v-if="loadingDone">
    <PageHeader title="StrInvoices" />
    <section
      class="invoice-item"
      v-for="invoice in invoices"
      :key="invoice.paidAt"
    >
      <div class="invoice-item-container" :class="$mq">
        <label class="system-headline-font">{{
          toMediumLocalizedDateString(invoice.paidAt)
        }}</label>
        <label class="invoice-amount-value">{{
          toLocalizedPriceString(invoice.amount)
        }}</label>
      </div>
      <div class="invoice-item-container" :class="$mq">
        <a :href="invoice.pdf">
          <CustomButton class="block default">{{
            $t('StrDownload')
          }}</CustomButton></a
        >
        <a :href="invoice.url">
          <CustomButton class="block default">{{
            $t('StrDetails')
          }}</CustomButton></a
        >
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { SubscriptionInvoice } from '@backend/systeminterfaces';
import { Vue, Component } from 'nuxt-property-decorator';
import { getAllSubscriptionInvoices } from '../../../../api/application/subscription/invoices';
import {
  getMediumLocalizedDateString,
  getLocalizedPriceString,
} from '../../../../utils/helper-methods';

@Component
export default class ApplicationInvoicesPage extends Vue {
  protected applicationId: string = '';

  protected invoices: SubscriptionInvoice[] = [];

  protected loadingDone: boolean = false;

  protected layout() {
    return 'application';
  }

  protected async fetch() {
    this.applicationId = this.$route.params.id;

    await this.loadSubscriptionInvoices();

    this.loadingDone = true;
  }

  protected async loadSubscriptionInvoices() {
    const result = await getAllSubscriptionInvoices(this.applicationId);

    if (result.error) {
      // ToDo: Error handling
      return;
    }

    this.invoices = result.invoices;
  }

  protected toMediumLocalizedDateString(milliseconds: number) {
    return getMediumLocalizedDateString(milliseconds, this.$i18n.locale);
  }

  protected toLocalizedPriceString(price: number) {
    return getLocalizedPriceString(price / 100, this.$i18n.locale);
  }
}
</script>

<style lang="postcss" scoped>
.invoice-item {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
  border-radius: 10px;
  background-color: var(--gray6-color);
}

.invoice-item + .invoice-item {
  margin-top: 20px;
}

.invoice-amount-value {
  color: var(--gray1-color);
}

.invoice-item-container {
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

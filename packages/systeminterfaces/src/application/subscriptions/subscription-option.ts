export interface SubscriptionOption {
  id: number;
  name: string;
  priceMonthId?: string;
  priceMonth?: number;
  priceYearId?: string;
  priceYear?: number;
  readRequests: number;
  writeRequests: number;
  dataStorageInGB: number;
  trial: boolean;
  active?: boolean;
  startDate?: number;
  currentPeriodEnd?: number;
  cancelAt?: number;
  canceledAt?: number;
  defaultCardId?: string;
}

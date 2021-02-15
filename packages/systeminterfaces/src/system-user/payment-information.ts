export interface PaymentInformation {
  card?: {
    id?: string;
    number?: string;
    last4?: string;
    brand?: string;
    owner: string;
    expirationMonth: string;
    expirationYear: string;
    cvc?: string;
    default?: boolean;
  };

  billingAddress?: {
    addressLineOne?: string;
    addressLineTwo: string;
    zipCode: string;
    city: string;
    stateRegionProvince: string;
    country: string;
  };
}

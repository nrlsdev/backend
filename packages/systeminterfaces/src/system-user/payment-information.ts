export interface PaymentInformation {
  card?: {
    number: string;
    owner: string;
    expirationMonth: string;
    expirationYear: string;
    cvc: string;
  };

  billingAddress?: {
    addressLineOne: string;
    addressLineTwo: string;
    zipCode: string;
    city: string;
    stateRegionProvince: string;
    country: string;
  };
}

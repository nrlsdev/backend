function getLocalizedDateString(
  milliseconds: number,
  countryCode: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = new Date(milliseconds);

  return date.toLocaleString(countryCode, options);
}

export function getMediumLocalizedDateString(
  milliseconds: number,
  countryCode: string,
) {
  return getLocalizedDateString(milliseconds, countryCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getLocalizedPriceString(price: number, countryCode: string) {
  // ToDo: pass currency from stripe
  return price.toLocaleString(countryCode, {
    style: 'currency',
    currency: 'USD',
  });
}

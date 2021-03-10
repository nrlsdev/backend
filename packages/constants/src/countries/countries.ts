// https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

export interface CountryTax {
  id: string;
}

export interface Country {
  name: string;

  flag: string;

  code2: string;

  code3: string;

  codeNumeric: string;

  languageCode: string;
}

export const Countries: Country[] = [
  {
    name: 'Austria',
    flag:
      'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg',
    code2: 'AT',
    code3: 'AUT',
    codeNumeric: '036',
    languageCode: 'de-AT',
  },
  {
    name: 'Germany',
    flag: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg',
    code2: 'DE',
    code3: 'DEU',
    codeNumeric: '276',
    languageCode: 'de-AT',
  },
  {
    name: 'United States of America',
    flag:
      'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg',
    code2: 'US',
    code3: 'USA',
    codeNumeric: '840',
    languageCode: 'en-US',
  },
  {
    name: 'Switzerland',
    flag:
      'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg',
    code2: 'CH',
    code3: 'CHE',
    codeNumeric: '756',
    languageCode: 'de-CH',
  },
  {
    name: 'United Kingdom',
    flag:
      'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg',
    code2: 'GB',
    code3: 'GBR',
    codeNumeric: '826',
    languageCode: '	en-GB',
  },
];

export function getCountryByCode2(code2: string) {
  const filteredCountries: Country[] =
    Countries.filter((country: Country) => {
      return country.code2 === code2;
    }) || [];

  return filteredCountries.length > 0 ? filteredCountries[0] : undefined;
}

export function getCountryByCode3(code3: string) {
  const filteredCountries: Country[] =
    Countries.filter((country: Country) => {
      return country.code3 === code3;
    }) || [];

  return filteredCountries.length > 0 ? filteredCountries[0] : undefined;
}

export function getCountryByCodeNumeric(codeNumeric: string) {
  const filteredCountries: Country[] =
    Countries.filter((country: Country) => {
      return country.codeNumeric === codeNumeric;
    }) || [];

  return filteredCountries.length > 0 ? filteredCountries[0] : undefined;
}

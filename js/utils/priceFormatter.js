import { brand } from '../config/brand.js';

const priceFormatter = new Intl.NumberFormat(brand.locale, {
  style: 'currency',
  currency: brand.currency,
  minimumFractionDigits: 0,
});

export function formatPriceWithCurrency(price) {
  return priceFormatter.format(price);
}

const priceFormatter = new Intl.NumberFormat('ru-RU');

export function formatPrice(price) {
  return priceFormatter.format(price);
}

export function formatPriceWithCurrency(price) {
  return `${formatPrice(price)} руб`;
}

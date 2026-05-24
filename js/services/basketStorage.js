const BASKET_STORAGE_KEY = 'basketItems';

export function getBasketItems() {
  const data = localStorage.getItem(BASKET_STORAGE_KEY);

  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Ошибка при чтении корзины:', error);
    return [];
  }
}

export function setBasketItems(items) {
  localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
}

export function clearBasketItems() {
  localStorage.removeItem(BASKET_STORAGE_KEY);
}

import { initCheckoutValidation } from '../components/formValidation.js';

export function initCheckoutPage(basket, catalogAvailable) {
  if (!catalogAvailable) {
    const message = document.querySelector(
      '.basket--checkout .basket__empty-block'
    );
    if (message) {
      message.setAttribute('role', 'alert');
      message.textContent = 'Не удалось загрузить каталог. Обновите страницу.';
    }
    return;
  }

  initCheckoutValidation(basket);
}

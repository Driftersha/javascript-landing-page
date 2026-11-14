let timeoutId;

export function announceCartAddition(product, quantity) {
  let toast = document.querySelector('[data-cart-toast]');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.dataset.cartToast = '';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }

  toast.replaceChildren();
  const title = document.createElement('strong');
  title.textContent = 'Добавлено в корзину';
  const details = document.createElement('span');
  details.textContent = product.name + ' · ' + quantity + ' шт. в корзине';
  const link = document.createElement('a');
  link.href = './checkout.html';
  link.textContent = 'Посмотреть корзину →';
  toast.append(title, details, link);
  toast.classList.add('cart-toast--visible');
  window.clearTimeout(timeoutId);
  timeoutId = window.setTimeout(
    () => toast.classList.remove('cart-toast--visible'),
    5500
  );
}

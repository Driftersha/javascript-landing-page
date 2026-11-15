// Импортируем утилитные функции для создания HTML-элементов
import {
  getDivEl,
  getImgEl,
  getSpanEl,
  getBtnEl,
  getLiEl,
  getSvgIcon,
} from './domHelpers.js';
import { formatPriceWithCurrency } from '../utils/priceFormatter.js';
import { announceCartAddition } from './cartToast.js';

export default class Basket {
  constructor(basketService) {
    this.basketService = basketService;
    this.basketList = document.querySelector('.header__basket .basket__list');
    this.basketCounter = document.querySelector('.header__user-count');
    this.basketButton = document.querySelector('.header__user-btn');
    this.basketElement = document.querySelector('.header__basket');
    this.emptyBlock = this.basketElement?.querySelector('.basket__empty-block');
    this.checkoutButton = document.querySelector('.basket__link');

    this.updateAll();

    // Обработчик для кнопки открытия/закрытия корзины
    if (this.basketButton && this.basketElement) {
      this.basketElement.id ||= 'header-basket';
      this.basketButton.setAttribute('aria-controls', this.basketElement.id);
      this.basketButton.setAttribute('aria-expanded', 'false');
      this.basketElement.inert = true;

      const closeBasket = () => {
        this.basketElement.classList.remove('basket--active');
        this.basketElement.inert = true;
        this.basketButton.setAttribute('aria-expanded', 'false');
      };

      this.basketButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = this.basketElement.classList.toggle('basket--active');
        this.basketElement.inert = !open;
        this.basketButton.setAttribute('aria-expanded', String(open));
      });

      this.basketElement.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      document.addEventListener('click', closeBasket);
      document.addEventListener('keydown', (event) => {
        if (
          event.key === 'Escape' &&
          this.basketElement.classList.contains('basket--active')
        ) {
          closeBasket();
          this.basketButton.focus();
        }
      });
    }
  }

  // Добавление товара в корзину
  addItem(product) {
    if (!this.basketService.addItem(product)) return;
    this.updateAll();
    announceCartAddition(
      product,
      this.getItems().find((item) => item.id === product.id)?.quantity ?? 1
    );
  }

  // Создание элемента корзины для каждого товара
  createBasketItem(product) {
    if (!product || !product.image) {
      console.error('Некорректные данные продукта:', product);
      return document.createElement('li');
    }

    const itemElement = getLiEl('basket__item');
    itemElement.dataset.id = product.id;

    const imgWrapper = getDivEl('basket__img');
    imgWrapper.append(getImgEl(product.image, '', 'basket__image'));

    const nameEl = getSpanEl(product.name, 'basket__name');
    const priceEl = getSpanEl(
      formatPriceWithCurrency(product.price.new * product.quantity),
      'basket__price'
    );
    const controls = getDivEl('basket__controls');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', `Количество: ${product.name}`);

    const decrease = this.createItemButton(
      'minus',
      'Уменьшить количество',
      () => this.basketService.decreaseQuantity(product.id)
    );
    decrease.disabled = product.quantity === 1;
    const increase = this.createItemButton('plus', 'Увеличить количество', () =>
      this.basketService.addItem(product)
    );
    increase.disabled = product.quantity === Number.MAX_SAFE_INTEGER;
    const quantity = getSpanEl(product.quantity, 'basket__quantity');
    quantity.setAttribute('aria-live', 'polite');
    controls.append(decrease, quantity, increase);

    const remove = this.createItemButton(
      'close',
      `Удалить товар: ${product.name}`,
      () => this.basketService.removeItem(product.id)
    );
    itemElement.append(imgWrapper, nameEl, priceEl, controls, remove);

    return itemElement;
  }

  createItemButton(icon, label, action) {
    const button = getBtnEl(
      label,
      'button',
      `basket__action basket__action--${icon}`
    );
    button.dataset.action = icon;
    button.append(getSvgIcon(`images/sprite.svg#icon-${icon}`, '', 18, 18));
    button.addEventListener('click', () => {
      action();
      this.updateAll();
    });
    return button;
  }

  renderList(container) {
    if (!container) return;

    const focused = container.contains(document.activeElement)
      ? document.activeElement
      : null;
    const row = focused?.closest('.basket__item');
    const rowIndex = row ? Array.from(container.children).indexOf(row) : -1;
    const items = this.getItems().map((product) =>
      this.createBasketItem(product)
    );

    container.replaceChildren(...items);
    if (!row) return;

    const nextRow =
      items.find((item) => item.dataset.id === row.dataset.id) ??
      items[Math.min(rowIndex, items.length - 1)];
    const nextControl =
      nextRow?.querySelector(
        `[data-action="${focused.dataset.action}"]:enabled`
      ) ??
      nextRow?.querySelector('button:enabled') ??
      this.basketButton;
    nextControl?.focus({ preventScroll: true });
  }

  // счётчика суммы товаров в корзине
  renderCheckoutTotal(selector) {
    const totalElement = document.querySelector(selector);

    if (!totalElement) return;

    totalElement.textContent = formatPriceWithCurrency(
      this.basketService.getTotalPrice()
    );
  }

  renderCheckoutState() {
    const checkoutContainer = document.querySelector('.basket--checkout');
    const checkoutList = document.querySelector(
      '.basket--checkout .basket__list'
    );
    const checkoutSummary = document.querySelector('.checkout__summary');
    const checkoutForm = document.querySelector('.checkout-form');

    if (!checkoutContainer) return;

    const hasItems = this.getItems().length > 0;

    if (checkoutList) {
      this.renderList(checkoutList);
    }

    this.renderCheckoutTotal('.checkout__total-price');

    let emptyBlock = checkoutContainer.querySelector('.basket__empty-block');

    if (!hasItems) {
      if (checkoutList) {
        checkoutList.innerHTML = '';
      }

      if (!emptyBlock) {
        emptyBlock = getDivEl('basket__empty-block');
        checkoutContainer.append(emptyBlock);
      }

      emptyBlock.textContent = 'Корзина пуста';
    } else if (emptyBlock) {
      emptyBlock.remove();
    }

    if (checkoutSummary) {
      checkoutSummary.style.display = hasItems ? 'flex' : 'none';
    }

    if (checkoutForm) {
      checkoutForm.style.display = hasItems ? 'block' : 'none';
    }
  }

  clear() {
    this.basketService.clear();
    this.updateAll();
  }

  // Обновление счётчика количества товаров в корзине
  updateBasketCounter() {
    if (this.basketCounter) {
      const quantity = this.basketService.getTotalQuantity();
      this.basketCounter.textContent = quantity;
      this.basketButton?.setAttribute(
        'aria-label',
        `Корзина, товаров: ${quantity}`
      );
    }
  }

  // Обновление состояния блока, если корзина пуста
  updateEmptyBlock() {
    const hasItems = this.getItems().length > 0;
    if (this.emptyBlock) {
      this.emptyBlock.style.display = hasItems ? 'none' : 'block';
    }
    if (this.checkoutButton) {
      this.checkoutButton.style.display = hasItems ? 'flex' : 'none';
    }
  }

  // Обновление интерфейса корзины (счётчик, блок "пусто", кнопка оформления)
  updateUI() {
    this.updateBasketCounter();
    this.updateEmptyBlock();
  }

  updateAll() {
    this.renderList(this.basketList);
    this.updateUI();
    this.renderCheckoutState();
  }

  // Получение всех товаров в корзине (геттер)
  getItems() {
    return this.basketService.getItems();
  }
}

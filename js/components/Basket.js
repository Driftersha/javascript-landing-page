// Импортируем утилитные функции для создания HTML-элементов
import {
  getDivEl,
  getImgEl,
  getSpanEl,
  getBtnEl,
  getLiEl,
  getSvgIcon,
} from './domHelpers.js';

export default class Basket {
  constructor(basketService) {
    this.basketService = basketService;
    this.basketList =
      document.querySelector('.basket__list') ?? document.createElement('ul');
    this.basketCounter = document.querySelector('.header__user-count');
    this.basketButton = document.querySelector('.header__user-btn');
    this.basketElement = document.querySelector('.header__basket');
    this.emptyBlock = document.querySelector('.basket__empty-block');
    this.checkoutButton = document.querySelector('.basket__link');

    this.updateAll();

    // Обработчик для кнопки открытия/закрытия корзины
    if (this.basketButton && this.basketElement) {
      this.basketButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.basketElement.classList.toggle('basket--active');
      });

      this.basketElement.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      document.addEventListener('click', () => {
        this.basketElement.classList.remove('basket--active');
      });
    }
  }

  // Добавление товара в корзину
  addItem(product) {
    this.basketService.addItem(product);
    this.updateAll();
  }

  // Удаление товара из корзины
  removeItem(productId) {
    this.basketService.removeItem(productId);
    this.updateAll();
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
    const img = getImgEl(product.image, product.name, 'basket__img');
    imgWrapper.append(img);

    const nameEl = getSpanEl(product.name, 'basket__name');
    const priceEl = getSpanEl(`${product.price.new} руб`, 'basket__price');
    const quantityEl = getSpanEl(product.quantity, 'basket__quantity');

    const removeBtn = getBtnEl('Удалить товар', 'button', 'basket__item-close');
    const icon = getSvgIcon(
      'images/sprite.svg#icon-close',
      'main-menu__icon',
      24,
      24
    );
    removeBtn.appendChild(icon);

    itemElement.append(imgWrapper, nameEl, priceEl, quantityEl, removeBtn);

    // Обработчик для удаления товара при клике на кнопку
    removeBtn.addEventListener('click', () => {
      this.removeItem(product.id);
    });

    return itemElement;
  }

  // Создание элемента корзины для каждого товара на странице оформления заказа
  renderCheckoutProducts(containerSelector) {
    const container = document.querySelector(containerSelector);

    if (!container) return;

    container.innerHTML = '';

    this.getItems().forEach((product) => {
      container.append(this.createBasketItem(product));
    });
  }

  // счётчика суммы товаров в корзине
  renderCheckoutTotal(selector) {
    const totalElement = document.querySelector(selector);

    if (!totalElement) return;

    totalElement.textContent = `${this.basketService.getTotalPrice()} руб`;
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
      this.renderCheckoutProducts('.basket--checkout .basket__list');
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

  // Обновление отображения корзины
  updateBasketDisplay() {
    this.basketList.innerHTML = '';
    this.getItems().forEach((product) => {
      this.basketList.appendChild(this.createBasketItem(product)); // Добавляем товары в список
    });
  }

  // Обновление счётчика количества товаров в корзине
  updateBasketCounter() {
    if (this.basketCounter) {
      this.basketCounter.textContent = this.basketService.getTotalQuantity();
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
    this.updateBasketDisplay();
    this.updateUI();
    this.renderCheckoutState();
  }

  // Получение всех товаров в корзине (геттер)
  getItems() {
    return this.basketService.getItems();
  }
}

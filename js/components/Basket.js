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
  constructor() {
    this.basketList =
      document.querySelector('.basket__list') ?? document.createElement('ul');
    this.basketCounter = document.querySelector('.header__user-count');
    this.basketButton = document.querySelector('.header__user-btn');
    this.basketElement = document.querySelector('.basket');
    this.emptyBlock = document.querySelector('.basket__empty-block');
    this.checkoutButton = document.querySelector('.basket__link');

    this.updateBasketDisplay();
    this.updateUI();

    // Обработчик для кнопки открытия/закрытия корзины
    this.basketButton.addEventListener('click', () => {
      this.basketElement.classList.toggle('basket--active');
    });
  }

  // Геттер для получения товаров из localStorage
  get items() {
    const data = localStorage.getItem('basketItems');
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Ошибка при чтении корзины:', e);
      return [];
    }
  }

  // Сеттер для сохранения товаров в localStorage
  set items(value) {
    localStorage.setItem('basketItems', JSON.stringify(value));
  }

  // Добавление товара в корзину
  addItem(product) {
    const items = this.items;
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    this.items = items;
    this.updateBasketDisplay();
    this.updateUI();
  }

  // Удаление товара из корзины
  removeItem(productId) {
    const items = this.items;
    const index = items.findIndex((item) => item.id === productId);

    if (index === -1) return;

    if (items[index].quantity > 1) {
      items[index].quantity -= 1;
    } else {
      items.splice(index, 1);
    }

    this.items = items;
    this.updateBasketDisplay();
    this.updateUI();
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
    removeBtn.addEventListener('click', (e) => {
      this.removeItem(product.id);
    });

    return itemElement;
  }

  // Обновление отображения корзины
  updateBasketDisplay() {
    this.basketList.innerHTML = '';
    this.items.forEach((product) => {
      this.basketList.appendChild(this.createBasketItem(product)); // Добавляем товары в список
    });
  }

  // Обновление счётчика количества товаров в корзине
  updateBasketCounter() {
    const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
    if (this.basketCounter) {
      this.basketCounter.textContent = total;
    }
  }

  // Обновление состояния блока, если корзина пуста
  updateEmptyBlock() {
    const hasItems = this.items.length > 0;
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

  // Получение всех товаров в корзине (геттер)
  getItems() {
    return this.items;
  }
}

import {
  getDivEl,
  getImgEl,
  getSpanEl,
  getH2El,
  getBtnEl,
  getUlEl,
  getLiEl,
  getSvgIcon,
} from './domHelpers.js';
import { formatPriceWithCurrency } from '../utils/priceFormatter.js';

// Константы для иконок и текстов
const ICON_BASKET = 'images/sprite.svg#icon-basket';
const ICON_TOOLTIP = 'images/sprite.svg#icon-i';
const ADD_TO_CART_TEXT = 'В корзину';
const MORE_DETAILS_TEXT = 'Подробнее';
const TOOLTIP_TEXT = 'Наличие товара по городам:';

export default class ProductCard {
  constructor(product, onAddToBasket) {
    this.product = product;
    this.onAddToBasket = onAddToBasket;
  }

  renderCard() {
    const card = getDivEl('product-card');

    // Визуальная часть с картинкой и кнопками
    const visualContainer = getDivEl('product-card__visual');
    const img = getImgEl(this.product.image, this.product.name);
    visualContainer.appendChild(img);

    const moreInfoContainer = getDivEl('product-card__more');
    const addToCartBtn = getBtnEl(
      'Добавить в корзину',
      'button',
      'product-card__btn btn btn--icon'
    );
    const cartIcon = getSvgIcon(ICON_BASKET, 'btn__text', 24, 24);
    const cartText = getSpanEl(ADD_TO_CART_TEXT, 'btn__text');
    addToCartBtn.append(cartIcon, cartText);

    const moreDetailsBtn = document.createElement('a');
    moreDetailsBtn.className = 'product-card__btn btn btn--secondary';
    moreDetailsBtn.href = `./product.html?id=${encodeURIComponent(this.product.id)}`;
    moreDetailsBtn.append(getSpanEl(MORE_DETAILS_TEXT, 'btn__text'));

    const stock = Object.values(this.product.availability ?? {}).reduce(
      (sum, count) => sum + count,
      0
    );
    if (stock <= 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.setAttribute('aria-label', 'Товара нет в наличии');
      cartText.textContent = 'Нет в наличии';
    }

    addToCartBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.addToBasket();
    });

    moreInfoContainer.append(addToCartBtn, moreDetailsBtn);
    visualContainer.appendChild(moreInfoContainer);

    const infoContainer = getDivEl('product-card__info');
    const title = getH2El(this.product.name);

    const oldPrice = this.createPriceBlock(
      this.product.price.old,
      'product-card__old'
    );
    const newPrice = this.createPriceBlock(
      this.product.price.new,
      'product-card__price'
    );

    infoContainer.append(title, oldPrice, newPrice);

    // Tooltip
    const tooltip = getDivEl('product-card__tooltip tooltip');
    const tooltipButton = getBtnEl('Показать подсказку');
    const tooltipIcon = getSvgIcon(ICON_TOOLTIP, 'tooltip__icon', 5, 10);
    tooltipButton.append(tooltipIcon);

    const tooltipContent = getDivEl('tooltip__content');
    const tooltipText = getSpanEl(TOOLTIP_TEXT, 'tooltip__text');
    const tooltipList = getUlEl('tooltip__list');

    const availability = this.product.availability || {};
    const cities = [
      { name: 'Москва', count: availability.moscow ?? 0 },
      { name: 'Оренбург', count: availability.orenburg ?? 0 },
      { name: 'Санкт-Петербург', count: availability.saintPetersburg ?? 0 },
    ];

    cities.forEach((city) => {
      const listItem = getLiEl('tooltip__item');
      const cityNameEl = getSpanEl(city.name, 'tooltip__text');
      const cityCountEl = getSpanEl(city.count, 'tooltip__count');
      listItem.append(cityNameEl, cityCountEl);
      tooltipList.appendChild(listItem);
    });

    tooltipContent.append(tooltipText, tooltipList);
    tooltip.appendChild(tooltipButton);
    infoContainer.appendChild(tooltip);

    // Инициализация тултипа, если доступна библиотека
    if (tooltipButton && typeof tippy === 'function') {
      tippy(tooltipButton, {
        content: tooltipContent.innerHTML,
        allowHTML: true,
        theme: 'lightwhite',
        placement: 'top-end',
        arrow: false,
      });
    }

    card.append(visualContainer, infoContainer);
    return card;
  }

  createPriceBlock(price, className) {
    const block = getDivEl(className);
    block.textContent = formatPriceWithCurrency(price);
    return block;
  }

  addToBasket() {
    if (typeof this.onAddToBasket === 'function') {
      this.onAddToBasket(this.product);
    } else {
      console.error('Обработчик добавления в корзину не передан');
    }
  }
}

import {
  getDivEl,
  getImgEl,
  getSpanEl,
  getBtnEl,
  getUlEl,
  getLiEl,
  getSvgIcon,
} from './domHelpers.js';
import { formatPrice } from '../utils/priceFormatter.js';

const CITIES = {
  moscow: 'Москва',
  orenburg: 'Оренбург',
  saintPetersburg: 'Санкт-Петербург',
};

export default class ProductCard {
  constructor(product, onAddToBasket) {
    this.product = product;
    this.onAddToBasket = onAddToBasket;
  }

  renderCard() {
    const product = this.product;
    const productUrl = `./product.html?id=${encodeURIComponent(product.id)}`;
    const card = getDivEl('product-card');
    const visual = document.createElement('a');
    visual.className = 'product-card__visual';
    visual.href = productUrl;
    visual.tabIndex = -1;
    visual.setAttribute('aria-label', `Подробнее: ${product.name}`);
    const image = getImgEl(product.image);
    image.loading = 'lazy';
    image.decoding = 'async';
    visual.append(image);

    const info = getDivEl('product-card__info');
    const title = document.createElement('h3');
    title.className = 'product-card__title';
    const titleLink = document.createElement('a');
    titleLink.href = productUrl;
    titleLink.textContent = product.name;
    title.append(titleLink);

    const prices = getDivEl('product-card__prices');
    const oldPrice = document.createElement('del');
    oldPrice.className = 'product-card__old';
    oldPrice.textContent = `${formatPrice(product.price.old)}\u00a0₽`;
    const price = getSpanEl(
      `${formatPrice(product.price.new)}\u00a0₽`,
      'product-card__price'
    );
    prices.append(price, oldPrice);

    const available = Object.values(product.availability ?? {}).some(
      (count) => count > 0
    );
    const addButton = getBtnEl(
      available ? `В корзину: ${product.name}` : 'Нет в наличии',
      'button',
      'product-card__btn btn',
      available ? 'В корзину' : 'Нет в наличии'
    );
    addButton.disabled = !available;
    if (available) {
      addButton.prepend(
        getSvgIcon('images/sprite.svg#icon-basket', '', 16, 16)
      );
      addButton.addEventListener('click', () => this.onAddToBasket?.(product));
    }

    const stockButton = this.createStockButton();
    if (stockButton) prices.append(stockButton);
    info.append(title, prices, addButton);
    card.append(visual, info);
    return card;
  }

  createStockButton() {
    if (typeof tippy !== 'function') return null;

    const button = getBtnEl(
      'Наличие по городам',
      'button',
      'product-card__stock'
    );
    button.append(getSvgIcon('images/sprite.svg#icon-i', '', 5, 10));
    const content = getDivEl('product-stock-content');
    const text = getSpanEl('Наличие по городам', 'tooltip__text');
    const list = getUlEl('tooltip__list');

    Object.entries(CITIES).forEach(([key, city]) => {
      const item = getLiEl('tooltip__item');
      item.append(
        getSpanEl(city, 'tooltip__text'),
        getSpanEl(this.product.availability?.[key] ?? 0, 'tooltip__count')
      );
      list.append(item);
    });

    content.append(text, list);
    tippy(button, {
      content,
      theme: 'lightwhite',
      placement: 'top-end',
      arrow: false,
      trigger: 'mouseenter focus click',
      appendTo: document.body,
    });
    return button;
  }
}

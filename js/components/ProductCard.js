import {
  getDivEl,
  getImgEl,
  getLinkEl,
  getSpanEl,
  getH2El,
  getBtnEl,
  getUlEl,
  getLiEl,
  getSvgIcon,
} from './domHelpers.js';

// Константы для иконок и текстов
const ICON_BASKET = 'images/sprite.svg#icon-basket';
const ICON_TOOLTIP = 'images/sprite.svg#icon-i';
const ADD_TO_CART_TEXT = 'В корзину';
const MORE_DETAILS_TEXT = 'Подробнее';
const TOOLTIP_TEXT = 'Наличие товара по городам:';

export default class ProductCard {
  constructor(product, basket) {
    this.product = product;
    this.basket = basket;
  }

  renderCard() {
    const card = getDivEl('product-card');

    // Визуальная часть с картинкой и кнопками
    const visualContainer = getDivEl('product-card__visual');
    const img = getImgEl(this.product.image, this.product.name);
    visualContainer.appendChild(img);

    const moreInfoContainer = getDivEl('product-card__more');
    const addToCartBtn = getLinkEl('#', 'product-card__link btn btn--icon');
    const cartIcon = getSvgIcon(ICON_BASKET, 'btn__text', 24, 24);
    const cartText = getSpanEl(ADD_TO_CART_TEXT, 'btn__text');
    addToCartBtn.append(cartIcon, cartText);

    const moreDetailsBtn = getLinkEl(
      '#',
      'product-card__link btn btn--secondary'
    );
    moreDetailsBtn.append(getSpanEl(MORE_DETAILS_TEXT, 'btn__text'));

    addToCartBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.addToBasket();
    });

    moreInfoContainer.append(addToCartBtn, moreDetailsBtn);
    visualContainer.appendChild(moreInfoContainer);

    const infoContainer = getDivEl('product-card__info');
    const title = getH2El(this.product.name);

    const formattedOldPrice = new Intl.NumberFormat('ru-RU').format(
      this.product.price.old
    );
    const formattedNewPrice = new Intl.NumberFormat('ru-RU').format(
      this.product.price.new
    );

    const oldPrice = this.createPriceBlock(
      formattedOldPrice,
      'product-card__old'
    );
    const newPrice = this.createPriceBlock(
      formattedNewPrice,
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
    const number = getSpanEl(price, `${className}-number`);
    const add = getSpanEl('₽', `${className}-add`);
    block.append(number, add);
    return block;
  }

  addToBasket() {
    if (this.basket && typeof this.basket.addItem === 'function') {
      this.basket.addItem(this.product);
    } else {
      console.error(
        'Корзина не инициализирована или метод addItem отсутствует'
      );
    }
  }
}

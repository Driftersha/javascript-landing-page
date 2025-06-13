import ProductCard from './ProductCard.js';
import { getLiEl } from './domHelpers.js';

export default class ProductCardSmall extends ProductCard {
  constructor(product, basket) {
    super(product, basket);
  }

  render() {
    const listItem = getLiEl('day-products__item', 'swiper-slide');
    const productCard = this.renderCard(); // вызываем метод родителя

    productCard.classList.add('product-card--small');
    listItem.appendChild(productCard);

    return listItem;
  }
}

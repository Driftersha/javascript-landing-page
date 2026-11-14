import ProductCardSmall from './productCardSmall.js';

export function initDayProductsSlider(products, onAddToBasket) {
  const dayProductsList = document.querySelector('.day-products__list');

  if (!dayProductsList) return;

  const dayProducts = products.filter((product) => product.goodsOfDay);

  dayProductsList.innerHTML = '';

  // Создаем карточки для каждого товара
  dayProducts.forEach((product) => {
    const productCard = new ProductCardSmall(product, onAddToBasket);
    const listItem = productCard.render();
    dayProductsList.appendChild(listItem);
  });

  // Инициализация слайдера
  new Swiper('.day-products__slider', {
    slidesPerView: 2,
    spaceBetween: 10,
    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
    watchOverflow: true,
    speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 400,
    breakpoints: {
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
    },
  });
}

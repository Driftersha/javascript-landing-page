import ProductCardSmall from './productCardSmall.js';

export function initDayProductsSlider(products, basket) {
  const dayProductsList = document.querySelector('.day-products__list');

  if (!dayProductsList) return;

  const dayProducts = products.filter((product) => product.goodsOfDay);

  dayProductsList.innerHTML = '';

  // Создаем карточки для каждого товара
  dayProducts.forEach((product) => {
    const productCard = new ProductCardSmall(product, basket);
    const listItem = productCard.render();
    dayProductsList.appendChild(listItem);
  });

  // Инициализация слайдера
  new Swiper('.day-products__slider', {
    slidesPerView: 4,
    spaceBetween: 40,
    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
    watchOverflow: true,
    speed: 500,
    breakpoints: {
      1024: { slidesPerView: 4 },
      768: { slidesPerView: 2 },
      480: { slidesPerView: 1 },
    },
  });
}

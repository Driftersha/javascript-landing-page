import ProductCard from './ProductCard.js';

// Функция для сортировки товаров
export function sortProducts(products, sortOption) {
  switch (sortOption) {
    case 'price-min':
      return products.sort((a, b) => a.price.new - b.price.new);
    case 'price-max':
      return products.sort((a, b) => b.price.new - a.price.new);
    case 'rating-max':
      return products.sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}

// Получение выбранной опции сортировки
export function getSortOption() {
  const sortSelect = document.querySelector('.catalog__sort-select');
  return sortSelect ? sortSelect.value : '';
}

// Обновление каталога после сортировки
export function updateProductCatalog(sortedProducts, basket) {
  const catalogList = document.querySelector('.catalog__list');
  catalogList.innerHTML = ''; // Очищаем текущий каталог

  sortedProducts.forEach((product) => {
    const productCard = new ProductCard(product);
    const card = productCard.createCard();

    const button = card.querySelector('.product-card__link');
    if (button) {
      button.dataset.id = product.id;
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        const selectedProduct = sortedProducts.find((item) => item.id == id);
        if (selectedProduct) {
          basket.addItem(selectedProduct);
        }
      });
    }

    catalogList.appendChild(card);
  });
}

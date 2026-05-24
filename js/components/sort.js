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

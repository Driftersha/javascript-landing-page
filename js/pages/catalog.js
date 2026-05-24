import { initFilters } from '../components/filters.js';
import { setupPagination } from '../components/pagination.js';
import { initDayProductsSlider } from '../components/slider.js';
import { getSortOption, sortProducts } from '../components/sort.js';

const CATALOG_LIST_SELECTOR = '.catalog__list';
const CATALOG_PAGINATION_SELECTOR = '.catalog__pagination';

export function initCatalogPage(basket) {
  const dayProductsList = document.querySelector('.day-products__list');
  const catalogList = document.querySelector(CATALOG_LIST_SELECTOR);

  if (!dayProductsList && !catalogList) return;

  fetch('./data/data.json')
    .then((response) => response.json())
    .then((products) => {
      if (dayProductsList) {
        initDayProductsSlider(products, basket);
      }

      if (catalogList) {
        initCatalog(products, basket);
      }
    })
    .catch((error) => {
      console.error('Ошибка при загрузке данных:', error);
    });
}

function initCatalog(products, basket) {
  let filteredProducts = [...products];

  renderCatalog(products, basket);

  initFilters(
    products,
    (filtered) => {
      filteredProducts = filtered;
      renderCatalog(getSortedProducts(filteredProducts), basket);
    },
    basket
  );

  const sortSelect = document.querySelector('.catalog__sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      renderCatalog(getSortedProducts(filteredProducts), basket);
    });
  }
}

function renderCatalog(products, basket) {
  setupPagination(
    products,
    CATALOG_LIST_SELECTOR,
    CATALOG_PAGINATION_SELECTOR,
    basket
  );
}

function getSortedProducts(products) {
  return sortProducts([...products], getSortOption());
}

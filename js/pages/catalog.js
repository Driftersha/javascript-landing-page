import { getProducts } from '../api/productsApi.js';
import { initFilters } from '../components/filters.js';
import { setupPagination } from '../components/pagination.js';
import { initDayProductsSlider } from '../components/slider.js';
import { getSortOption, sortProducts } from '../components/sort.js';

const CATALOG_LIST_SELECTOR = '.catalog__list';
const CATALOG_PAGINATION_SELECTOR = '.catalog__pagination';

export async function initCatalogPage(basket) {
  const dayProductsList = document.querySelector('.day-products__list');
  const catalogList = document.querySelector(CATALOG_LIST_SELECTOR);

  if (!dayProductsList && !catalogList) return;

  try {
    const products = await getProducts();
    const onAddToBasket = (product) => {
      basket.addItem(product);
    };

    if (dayProductsList) {
      initDayProductsSlider(products, onAddToBasket);
    }

    if (catalogList) {
      initCatalog(products, onAddToBasket);
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

function initCatalog(products, onAddToBasket) {
  let filteredProducts = [...products];

  renderCatalog(products, onAddToBasket);

  initFilters(
    products,
    (filtered) => {
      filteredProducts = filtered;
      renderCatalog(getSortedProducts(filteredProducts), onAddToBasket);
    }
  );

  const sortSelect = document.querySelector('.catalog__sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      renderCatalog(getSortedProducts(filteredProducts), onAddToBasket);
    });
  }
}

function renderCatalog(products, onAddToBasket) {
  setupPagination(
    products,
    CATALOG_LIST_SELECTOR,
    CATALOG_PAGINATION_SELECTOR,
    onAddToBasket
  );
}

function getSortedProducts(products) {
  return sortProducts([...products], getSortOption());
}

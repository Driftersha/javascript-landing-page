import { getProducts } from '../api/productsApi.js';
import { initFilters } from '../components/filters.js';
import { setupPagination } from '../components/pagination.js';
import { initDayProductsSlider } from '../components/slider.js';
import { getSortOption, sortProducts } from '../components/sort.js';

const CATALOG_LIST_SELECTOR = '.catalog__list';
const CATALOG_PAGINATION_SELECTOR = '.catalog__pagination';
const CATALOG_ERROR_CLASS = 'catalog__error';
const CATALOG_ERROR_TEXT = 'Не удалось загрузить товары. Попробуйте позже.';

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
    renderCatalogError();
  }
}

function initCatalog(products, onAddToBasket) {
  let filteredProducts = [...products];

  renderCatalog(products, onAddToBasket);

  initFilters(products, (filtered) => {
    filteredProducts = filtered;
    renderCatalog(getSortedProducts(filteredProducts), onAddToBasket);
  });

  const sortSelect = document.querySelector('.catalog__sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      renderCatalog(getSortedProducts(filteredProducts), onAddToBasket);
    });
  }
}

function renderCatalog(products, onAddToBasket) {
  removeCatalogError();

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

function renderCatalogError() {
  const catalogList = document.querySelector(CATALOG_LIST_SELECTOR);
  const pagination = document.querySelector(CATALOG_PAGINATION_SELECTOR);

  if (!catalogList) return;

  catalogList.innerHTML = '';

  if (pagination) {
    pagination.innerHTML = '';
    pagination.style.display = 'none';
  }

  removeCatalogError();

  const errorMessage = document.createElement('p');
  errorMessage.classList.add(CATALOG_ERROR_CLASS);
  errorMessage.textContent = CATALOG_ERROR_TEXT;

  catalogList.insertAdjacentElement('afterend', errorMessage);
}

function removeCatalogError() {
  const errorMessage = document.querySelector(`.${CATALOG_ERROR_CLASS}`);

  if (errorMessage) {
    errorMessage.remove();
  }
}

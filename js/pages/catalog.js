import { getProducts } from '../api/productsApi.js';
import { initFilters } from '../components/filters.js';
import { setupPagination } from '../components/pagination.js';
import { initDayProductsSlider } from '../components/slider.js';
import { getSortOption, sortProducts } from '../components/sort.js';

const CATALOG_LIST_SELECTOR = '.catalog__list';
const CATALOG_PAGINATION_SELECTOR = '.catalog__pagination';
const CATALOG_ERROR_CLASS = 'catalog__error';
const CATALOG_ERROR_TEXT = 'Не удалось загрузить товары. Попробуйте позже.';
const CATALOG_EMPTY_CLASS = 'catalog__empty';
const CATALOG_EMPTY_TEXT = 'По выбранным фильтрам товары не найдены';

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
  const filterToggle = document.querySelector('.catalog__filter-toggle');
  const filterCount = document.querySelector('.catalog__filter-count');
  const filterForm = document.querySelector('.catalog-form');
  const catalogCount = document.querySelector('.catalog__count');

  filterToggle?.addEventListener('click', () => {
    const expanded = filterToggle.getAttribute('aria-expanded') === 'true';
    filterToggle.setAttribute('aria-expanded', String(!expanded));
  });

  filterForm?.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      filterToggle?.getAttribute('aria-expanded') === 'true' &&
      filterToggle.getClientRects().length
    ) {
      filterToggle.setAttribute('aria-expanded', 'false');
      filterToggle.focus();
    }
  });
  const updatePagination = setupPagination(
    products,
    CATALOG_LIST_SELECTOR,
    CATALOG_PAGINATION_SELECTOR,
    onAddToBasket
  );

  initFilters(products, (filtered) => {
    filteredProducts = filtered;
    renderCatalog(getSortedProducts(filteredProducts), { resetPage: true });
  });

  renderCatalog(getSortedProducts(filteredProducts), { resetPage: true });

  const sortSelect = document.querySelector('.catalog__sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      renderCatalog(getSortedProducts(filteredProducts), { resetPage: true });
    });
  }

  function renderCatalog(productsToRender, options = {}) {
    removeCatalogError();
    removeCatalogEmpty();

    if (catalogCount)
      catalogCount.textContent = `Найдено: ${productsToRender.length}`;
    if (filterForm && filterCount) {
      const activeCount = filterForm.querySelectorAll(
        'input[name="type"]:checked, input[value="instock"]:checked'
      ).length;
      filterCount.hidden = activeCount === 0;
      filterCount.textContent = activeCount;
    }

    updatePagination(productsToRender, options);
    if (productsToRender.length === 0) renderCatalogEmpty();
  }
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

function renderCatalogEmpty() {
  const catalogList = document.querySelector(CATALOG_LIST_SELECTOR);
  const pagination = document.querySelector(CATALOG_PAGINATION_SELECTOR);

  if (!catalogList) return;

  catalogList.innerHTML = '';

  if (pagination) {
    pagination.innerHTML = '';
    pagination.style.display = 'none';
  }

  const emptyMessage = document.createElement('p');
  emptyMessage.classList.add(CATALOG_EMPTY_CLASS);
  emptyMessage.textContent = CATALOG_EMPTY_TEXT;

  catalogList.insertAdjacentElement('afterend', emptyMessage);
}

function removeCatalogEmpty() {
  const emptyMessage = document.querySelector(`.${CATALOG_EMPTY_CLASS}`);

  if (emptyMessage) {
    emptyMessage.remove();
  }
}

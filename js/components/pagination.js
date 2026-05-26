import { getBtnEl, getLiEl } from './domHelpers.js';
import ProductCard from './ProductCard.js';

// Функция рендера карточек на текущей странице
function renderPage(page, products, container, itemsPerPage, onAddToBasket) {
  container.innerHTML = '';

  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;
  const visible = products.slice(start, end);

  visible.forEach((product) => {
    const card = new ProductCard(product, onAddToBasket);
    container.appendChild(card.renderCard());
  });
}

// Функция рендера пагинации
function renderPagination(
  products,
  pagination,
  currentPage,
  itemsPerPage,
  onPageChange
) {
  pagination.innerHTML = '';
  if (products.length <= itemsPerPage) {
    pagination.style.display = 'none';
    return;
  }
  pagination.style.display = 'flex';

  const pages = Math.ceil(products.length / itemsPerPage);

  // Создаём кнопки пагинации
  for (let i = 1; i <= pages; i++) {
    const li = getLiEl('catalog__pagination-item');

    const btn = getBtnEl(
      'Переключить страницу',
      'button',
      'catalog__pagination-link',
      i
    );

    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', () => {
      onPageChange(i);
    });

    li.appendChild(btn);
    pagination.appendChild(li);
  }
}

// Основная функция для установки пагинации
export function setupPagination(
  products,
  containerSelector,
  paginationSelector,
  onAddToBasket,
  itemsPerPage = 6
) {
  const container = document.querySelector(containerSelector);
  const pagination = document.querySelector(paginationSelector);
  let currentPage = 1;

  function getPageCount(pageProducts) {
    return Math.max(1, Math.ceil(pageProducts.length / itemsPerPage));
  }

  function render(pageProducts) {
    renderPage(
      currentPage,
      pageProducts,
      container,
      itemsPerPage,
      onAddToBasket
    );
    renderPagination(
      pageProducts,
      pagination,
      currentPage,
      itemsPerPage,
      (page) => {
        currentPage = page;
        render(pageProducts);
      }
    );
  }

  // Функция для обновления пагинации с новыми данными
  function updatePagination(newProducts, options = {}) {
    if (options.resetPage) {
      currentPage = 1;
    } else {
      currentPage = Math.min(currentPage, getPageCount(newProducts));
    }

    render(newProducts);
  }

  updatePagination(products, { resetPage: true });

  return updatePagination;
}

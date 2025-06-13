import { getBtnEl, getLiEl } from './domHelpers.js';
import ProductCard from './ProductCard.js';

// Функция рендера карточек на текущей странице
function renderPage(page, products, container, itemsPerPage, basket) {
  container.innerHTML = '';

  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;
  const visible = products.slice(start, end);

  visible.forEach((product) => {
    const card = new ProductCard(product, basket);
    container.appendChild(card.renderCard());
  });
}

// Функция рендера пагинации
function renderPagination(
  products,
  pagination,
  currentPage,
  itemsPerPage,
  basket,
  updatePagination
) {
  pagination.innerHTML = '';
  if (products.length <= itemsPerPage) {
    pagination.style.display = 'none';
    return;
  } else {
    pagination.style.display = 'flex';
  }

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
      currentPage = i;

      renderPage(
        currentPage,
        products,
        document.querySelector('.catalog__list'),
        itemsPerPage,
        basket
      );
      renderPagination(
        products,
        pagination,
        currentPage,
        itemsPerPage,
        basket,
        updatePagination
      );
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
  basket,
  itemsPerPage = 6
) {
  const container = document.querySelector(containerSelector);
  const pagination = document.querySelector(paginationSelector);
  let currentPage = 1;

  renderPage(currentPage, products, container, itemsPerPage, basket);
  renderPagination(
    products,
    pagination,
    currentPage,
    itemsPerPage,
    basket,
    updatePagination
  );

  // Функция для обновления пагинации с новыми данными
  function updatePagination(newProducts) {
    renderPage(currentPage, newProducts, container, itemsPerPage, basket);
    renderPagination(
      newProducts,
      pagination,
      currentPage,
      itemsPerPage,
      basket,
      updatePagination
    );
  }

  return updatePagination;
}

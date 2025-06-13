// Подсчёт товаров по категориям
function getCategoryCounts(products) {
  return products.reduce((acc, product) => {
    product.type.forEach((category) => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {});
}

// Обновление количества товаров в интерфейсе
function showCategoryCounts(counts) {
  const items = document.querySelectorAll('.catalog-form__item-col');

  items.forEach((item) => {
    const input = item.querySelector('input');
    const countElement = item.querySelector('.custom-checkbox__count');
    if (countElement && input) {
      countElement.textContent = counts[input.value] || 0;
    }
  });
}

// Проверка: попадает ли товар под выбранные категории
function matchesCategory(product, selectedCategories) {
  return (
    selectedCategories.length === 0 ||
    selectedCategories.some((cat) => product.type.includes(cat))
  );
}

// Проверка: есть ли товар в наличии
function matchesStock(product, onlyInStock) {
  if (!onlyInStock) return true;
  const total = Object.values(product.availability || {}).reduce(
    (sum, num) => sum + num,
    0
  );
  return total > 0;
}

// Основная фильтрация
export function filterProducts(products, selectedCategories, onlyInStock) {
  return products.filter(
    (product) =>
      matchesCategory(product, selectedCategories) &&
      matchesStock(product, onlyInStock)
  );
}

// Инициализация фильтра
export function initFilters(products, renderProducts) {
  const counts = getCategoryCounts(products);
  showCategoryCounts(counts);

  const checkboxes = document.querySelectorAll('.catalog-form__item-col input');
  const radioInStock = document.querySelector(
    'input[name="status"][value="instock"]'
  );
  const radioAll = document.querySelector(
    'input[name="status"][value="all-item"]'
  );
  const resetBtn = document.querySelector('.catalog-form__reset');

  let selectedCategories = [];
  let onlyInStock = false;

  function applyFilters() {
    const result = filterProducts(products, selectedCategories, onlyInStock);
    renderProducts(result);
  }

  function handleCategoryChange(e) {
    const { value, checked } = e.target;
    selectedCategories = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((cat) => cat !== value);
    applyFilters();
  }

  function handleStockChange(e) {
    onlyInStock = e.target.value === 'instock' && e.target.checked;
    applyFilters();
  }

  function resetFilters(e) {
    e.preventDefault();
    selectedCategories = [];
    onlyInStock = false;

    checkboxes.forEach((cb) => (cb.checked = false));
    if (radioAll) radioAll.checked = true;
    if (radioInStock) radioInStock.checked = false;

    renderProducts(products);
  }

  checkboxes.forEach((cb) =>
    cb.addEventListener('change', handleCategoryChange)
  );
  if (radioInStock) radioInStock.addEventListener('change', handleStockChange);
  if (radioAll) radioAll.addEventListener('change', handleStockChange);
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

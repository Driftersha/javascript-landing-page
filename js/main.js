// --- Импорты компонентов ---
import Basket from './components/Basket.js';
import { initBurgerMenu } from './components/burgerMenu.js';
import { initCityDropdown } from './components/cityDropdown.js';
import { initFilters } from './components/filters.js';
import { sortProducts, getSortOption } from './components/sort.js';
import { initAccordion } from './components/accordion.js';
import { initDayProductsSlider } from './components/slider.js';
import { initFormValidation } from './components/formValidation.js';
import { setupPagination } from './components/pagination.js';
import { initGlobalRipple } from './components/ripple.js';

// Инициализация ripple-эффекта по клику в любом месте страницы
initGlobalRipple();

// --- Инициализация UI компонентов ---
initBurgerMenu();
initCityDropdown();
initAccordion();
initFormValidation();

// --- Инициализация корзины (компонент, реализующий добавление и хранение товаров) ---
const basket = new Basket();

// --- Массивы для хранения товаров и отфильтрованных товаров ---
let products = [];
let filteredProducts = [];

// --- Загрузка данных для слайдера "Товары дня" ---
fetch('./data/data.json')
  .then((response) => response.json())
  .then((data) => {
    initDayProductsSlider(data, basket);
  })
  .catch((error) => {
    console.error('Ошибка загрузки данных для слайдера:', error);
  });

// --- Загрузка данных каталога и инициализация фильтров, сортировки, пагинации ---
fetch('./data/data.json')
  .then((response) => response.json())
  .then((data) => {
    products = data;
    filteredProducts = [...products];

    // Инициализация пагинации с полным списком товаров
    setupPagination(
      filteredProducts,
      '.catalog__list',
      '.catalog__pagination',
      basket
    );

    // Инициализация фильтров
    initFilters(
      products,
      (filtered) => {
        filteredProducts = filtered;
        const sortOption = getSortOption();
        const sortedProducts = sortProducts([...filteredProducts], sortOption);

        // Повторная инициализация пагинации для отфильтрованных и отсортированных данных
        setupPagination(
          sortedProducts,
          '.catalog__list',
          '.catalog__pagination',
          basket
        );
      },
      basket
    );

    // Инициализация сортировки
    const sortSelect = document.querySelector('.catalog__sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const sortOption = getSortOption();
        const sortedProducts = sortProducts([...filteredProducts], sortOption);

        // Обновление пагинации при выборе новой сортировки
        setupPagination(
          sortedProducts,
          '.catalog__list',
          '.catalog__pagination',
          basket
        );
      });
    }
  })
  .catch((error) => {
    console.error('Ошибка при загрузке данных товаров:', error);
  });

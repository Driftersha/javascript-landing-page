// --- Импорты компонентов ---
import Basket from './components/Basket.js';
import { initBurgerMenu } from './components/burgerMenu.js';
import { initCityDropdown } from './components/cityDropdown.js';
import { initAccordion } from './components/accordion.js';
import { initFormValidation } from './components/formValidation.js';
import { initGlobalRipple } from './components/ripple.js';
import { initCatalogPage } from './pages/catalog.js';
import { initCheckoutPage } from './pages/checkout.js';

// Инициализация ripple-эффекта по клику в любом месте страницы
initGlobalRipple();

// --- Инициализация UI компонентов ---
initBurgerMenu();
initCityDropdown();
initAccordion();
initFormValidation();

// --- Инициализация корзины (компонент, реализующий добавление и хранение товаров) ---
const basket = new Basket();

// --- Инициализация страниц ---
initCatalogPage(basket);
initCheckoutPage(basket);

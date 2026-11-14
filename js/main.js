// --- Импорты компонентов ---
import Basket from './components/Basket.js';
import { initPageEnhancements } from './components/pageEnhancements.js';
import { initBurgerMenu } from './components/burgerMenu.js';
import { initCityDropdown } from './components/cityDropdown.js';
import { initAccordion } from './components/accordion.js';
import { initFormValidation } from './components/formValidation.js';
import { initCatalogPage } from './pages/catalog.js';
import { initCheckoutPage } from './pages/checkout.js';
import { initProductPage } from './pages/product.js';
import { createBasketService } from './services/basketService.js';

// --- Инициализация UI компонентов ---
initBurgerMenu();
initCityDropdown();
initAccordion();
initFormValidation();
initPageEnhancements();

// --- Инициализация корзины (компонент, реализующий добавление и хранение товаров) ---
const basketService = createBasketService();
const basket = new Basket(basketService);

// --- Инициализация страниц ---
initCatalogPage(basket);
initCheckoutPage(basket);

initProductPage(basket);

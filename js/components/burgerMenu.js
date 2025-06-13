// Открытие и закрытие бургерного меню каталога
export function initBurgerMenu() {
  const catalogToggleBtn = document.querySelector('.header__catalog-btn');
  const menuCloseBtn = document.querySelector('.main-menu__close');
  const mainMenu = document.querySelector('.main-menu');

  // Открытие меню
  catalogToggleBtn.addEventListener('click', () => {
    mainMenu.classList.add('main-menu--active');
  });

  // Закрытие меню
  menuCloseBtn.addEventListener('click', () => {
    mainMenu.classList.remove('main-menu--active');
  });
}

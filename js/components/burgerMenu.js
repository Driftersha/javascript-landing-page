// Открытие и закрытие бургерного меню каталога
export function initBurgerMenu() {
  const catalogToggleBtn = document.querySelector('.header__catalog-btn');
  const menuCloseBtn = document.querySelector('.main-menu__close');
  const mainMenu = document.querySelector('.main-menu');
  const mainMenuWrapper = document.querySelector('.main-menu__wrapper');

  if (!catalogToggleBtn || !menuCloseBtn || !mainMenu || !mainMenuWrapper) {
    return;
  }

  // Открытие меню
  catalogToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    mainMenu.classList.add('main-menu--active');
  });

  // Закрытие меню
  menuCloseBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    mainMenu.classList.remove('main-menu--active');
  });

  mainMenuWrapper.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  mainMenu.addEventListener('click', () => {
    mainMenu.classList.remove('main-menu--active');
  });

  document.addEventListener('click', () => {
    mainMenu.classList.remove('main-menu--active');
  });
}

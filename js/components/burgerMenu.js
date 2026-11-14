export function initBurgerMenu() {
  const catalogToggleBtn = document.querySelector('.header__catalog-btn');
  const menuCloseBtn = document.querySelector('.main-menu__close');
  const mainMenu = document.querySelector('.main-menu');
  const mainMenuWrapper = document.querySelector('.main-menu__wrapper');

  if (!catalogToggleBtn || !menuCloseBtn || !mainMenu || !mainMenuWrapper) {
    return;
  }

  mainMenu.id ||= 'catalog-menu';
  catalogToggleBtn.setAttribute('aria-controls', mainMenu.id);
  catalogToggleBtn.setAttribute('aria-expanded', 'false');
  menuCloseBtn.setAttribute('aria-label', 'Закрыть каталог');
  mainMenu.inert = true;

  function closeMenu(returnFocus = false) {
    mainMenu.classList.remove('main-menu--active');
    mainMenu.inert = true;
    catalogToggleBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) catalogToggleBtn.focus();
  }

  catalogToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    mainMenu.classList.add('main-menu--active');
    mainMenu.inert = false;
    catalogToggleBtn.setAttribute('aria-expanded', 'true');
    menuCloseBtn.focus();
  });

  menuCloseBtn.addEventListener('click', () => closeMenu(true));
  mainMenuWrapper.addEventListener('click', (event) => {
    event.stopPropagation();
    if (event.target.closest('.main-menu__link')) closeMenu();
  });
  mainMenu.addEventListener('click', () => closeMenu());
  document.addEventListener('click', (event) => {
    if (!catalogToggleBtn.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mainMenu.inert) closeMenu(true);
  });
}

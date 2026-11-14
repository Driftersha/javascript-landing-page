import { getSvgIcon } from './domHelpers.js';

export function initPageEnhancements() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Наверх страницы');
  button.append(getSvgIcon('images/sprite.svg#icon-up', '', 22, 22));
  document.body.append(button);

  const update = () => {
    button.classList.toggle('back-to-top--visible', window.scrollY > 420);
  };
  button.addEventListener('click', () => {
    document
      .querySelector('.header__logo-link')
      ?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
}

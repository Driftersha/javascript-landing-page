export function initPageEnhancements() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Наверх страницы');
  button.textContent = '↑';
  document.body.append(button);

  const update = () => {
    button.classList.toggle('back-to-top--visible', window.scrollY > 420);
  };
  button.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
  window.addEventListener('scroll', update, { passive: true });
  update();
}

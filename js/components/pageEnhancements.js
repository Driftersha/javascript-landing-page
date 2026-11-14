export function initPageEnhancements() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Наверх страницы');
  button.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 20V4m-6 6 6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

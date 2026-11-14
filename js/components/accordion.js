export function initAccordion() {
  const buttons = document.querySelectorAll('.accordion__btn');

  buttons.forEach((button, index) => {
    const panel = button.nextElementSibling;
    if (panel?.classList.contains('accordion__content')) {
      panel.id ||= `accordion-panel-${index + 1}`;
      button.setAttribute('aria-controls', panel.id);
    }
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', () => {
      const isActive = button.classList.contains('accordion__btn--active');

      // Закрываем все кнопки и контенты
      buttons.forEach((btn) => {
        btn.classList.remove('accordion__btn--active');
        btn.setAttribute('aria-expanded', 'false');
        const content = btn.nextElementSibling;
        if (content && content.classList.contains('accordion__content')) {
          content.classList.remove('open');
        }
      });

      // Если клик был не по активной кнопке, то открываем её
      if (!isActive) {
        button.classList.add('accordion__btn--active');
        button.setAttribute('aria-expanded', 'true');
        const content = button.nextElementSibling;
        if (content && content.classList.contains('accordion__content')) {
          content.classList.add('open');
        }
      }
    });
  });
}

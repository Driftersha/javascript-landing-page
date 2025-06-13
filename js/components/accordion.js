export function initAccordion() {
  const buttons = document.querySelectorAll('.accordion__btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const isActive = button.classList.contains('accordion__btn--active');

      // Закрываем все кнопки и контенты
      buttons.forEach((btn) => {
        btn.classList.remove('accordion__btn--active');
        const content = btn.nextElementSibling;
        if (content && content.classList.contains('accordion__content')) {
          content.classList.remove('open');
        }
      });

      // Если клик был не по активной кнопке, то открываем её
      if (!isActive) {
        button.classList.add('accordion__btn--active');
        const content = button.nextElementSibling;
        if (content && content.classList.contains('accordion__content')) {
          content.classList.add('open');
        }
      }
    });
  });
}

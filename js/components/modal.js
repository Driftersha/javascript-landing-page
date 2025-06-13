import {
  getDivEl,
  getSpanEl,
  getBtnEl,
  getSvgIcon,
  getH2El,
} from './domHelpers.js';

export function showModal({ iconId = '', title = '', message = '' }) {
  if (document.querySelector('.modal')) return;

  // Создаём элементы
  const modalEl = getDivEl('modal');
  const modalContent = getDivEl('modal__content');
  const icon = getSvgIcon(`images/sprite.svg#${iconId}`, 'modal__icon', 44, 44);
  const titleEl = getH2El(title, 'modal__title');
  const messageEl = getSpanEl(message, 'modal__message');
  const closeBtn = getBtnEl('Закрыть сообщение', 'button', 'modal__close');
  const closeIcon = getSvgIcon(
    'images/sprite.svg#icon-close',
    'modal__icon-close',
    24,
    24
  );
  closeBtn.append(closeIcon);

  // Добавляем структуру
  modalContent.append(icon, titleEl, messageEl, closeBtn);
  modalEl.appendChild(modalContent);
  document.body.appendChild(modalEl);

  // Обработчик закрытия
  closeBtn.addEventListener('click', () => {
    modalEl.remove();
  });
}

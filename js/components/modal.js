import {
  getDivEl,
  getSpanEl,
  getBtnEl,
  getSvgIcon,
  getH2El,
} from './domHelpers.js';

export function showModal({ iconId = '', title = '', message = '' }) {
  if (document.querySelector('.modal')) return;

  const previousFocus = document.activeElement;
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

  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  titleEl.id = 'modal-title';
  messageEl.id = 'modal-message';
  modalEl.setAttribute('aria-labelledby', titleEl.id);
  modalEl.setAttribute('aria-describedby', messageEl.id);

  function close() {
    modalEl.remove();
    document.removeEventListener('keydown', onKeyDown);
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus();
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      event.preventDefault();
      closeBtn.focus();
    }
  }

  modalContent.append(icon, titleEl, messageEl, closeBtn);
  modalEl.appendChild(modalContent);
  document.body.appendChild(modalEl);
  closeBtn.addEventListener('click', close);
  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl) close();
  });
  document.addEventListener('keydown', onKeyDown);
  closeBtn.focus();
}

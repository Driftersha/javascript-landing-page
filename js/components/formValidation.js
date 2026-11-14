import { API_ENDPOINTS } from '../config.js';
import { submitRequest } from '../services/submitRequest.js';
import { showModal } from './modal.js';

function showSubmissionError() {
  showModal({
    iconId: 'icon-warning',
    title: 'Не удалось отправить данные',
    message: 'Пожалуйста, попробуйте позже или свяжитесь с магазином.',
  });
}

export function initFormValidation() {
  const form = document.querySelector('.questions__form');
  if (!form) return;

  const validation = new JustValidate(form);
  validation
    .addField('#name', [
      { rule: 'required', errorMessage: 'Введите ваше имя' },
      { rule: 'minLength', value: 3, errorMessage: 'Минимальная длина — 3 символа' },
      { rule: 'maxLength', value: 50, errorMessage: 'Максимальная длина — 50 символов' },
    ])
    .addField('#email', [
      { rule: 'required', errorMessage: 'Введите вашу почту' },
      { rule: 'email', errorMessage: 'Почта введена неверно' },
    ])
    .addField('#agree', [
      { rule: 'required', errorMessage: 'Согласие обязательно' },
    ])
    .onSuccess(async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton?.disabled) return;
      if (submitButton) submitButton.disabled = true;

      try {
        const result = await submitRequest(API_ENDPOINTS.consultation, {
          name: form.querySelector('#name').value.trim(),
          email: form.querySelector('#email').value.trim(),
          agree: form.querySelector('#agree').checked,
        });

        if (result.demo) {
          showModal({
            iconId: 'icon-i',
            title: 'Демонстрационная форма',
            message: 'Заявка не отправлена: сервер обработки обращений не подключён. Данные остались только в браузере.',
          });
          return;
        }

        showModal({
          iconId: 'icon-completed',
          title: 'Обращение отправлено',
          message: 'Мы получили ваше обращение.',
        });
        form.reset();
      } catch (error) {
        console.error('Ошибка отправки обращения:', error);
        showSubmissionError();
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
}

export function initCheckoutValidation(basket) {
  const form = document.querySelector('.checkout-form');
  if (!form) return;

  const validation = new JustValidate(form);
  validation
    .addField('#checkout-name', [
      { rule: 'required', errorMessage: 'Введите ваше имя' },
      { rule: 'minLength', value: 3, errorMessage: 'Минимальная длина — 3 символа' },
    ])
    .addField('#checkout-phone', [
      { rule: 'required', errorMessage: 'Введите номер телефона' },
    ])
    .addField('#checkout-address', [
      { rule: 'required', errorMessage: 'Введите адрес доставки' },
    ])
    .addField('#checkout-agree', [
      { rule: 'required', errorMessage: 'Согласие обязательно' },
    ])
    .onSuccess(async (event) => {
      event.preventDefault();
      const items = basket?.getItems() ?? [];
      if (!items.length) {
        showModal({
          iconId: 'icon-warning',
          title: 'Корзина пуста',
          message: 'Добавьте товары перед оформлением заказа.',
        });
        return;
      }

      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton?.disabled) return;
      if (submitButton) submitButton.disabled = true;

      try {
        const result = await submitRequest(API_ENDPOINTS.orders, {
          customer: {
            name: form.querySelector('#checkout-name').value.trim(),
            phone: form.querySelector('#checkout-phone').value.trim(),
            address: form.querySelector('#checkout-address').value.trim(),
          },
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        });

        if (result.demo) {
          showModal({
            iconId: 'icon-i',
            title: 'Демонстрация оформления',
            message: 'Заказ не создан и никуда не отправлен. Корзина сохранена. Для реальных заказов необходимо подключить сервер.',
          });
          return;
        }

        showModal({
          iconId: 'icon-completed',
          title: 'Заказ отправлен',
          message: 'Заказ принят системой для дальнейшей обработки.',
        });
        form.reset();
        basket.clear();
      } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showSubmissionError();
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
}

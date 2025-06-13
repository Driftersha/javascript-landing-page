import { showModal } from './modal.js';

export function initFormValidation() {
  const form = document.querySelector('.questions__form');

  const validation = new JustValidate(form);

  // Настраиваем правила валидации для каждого поля
  validation
    .addField('#name', [
      { rule: 'required', errorMessage: 'Введите ваше имя' },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Минимальная длина три символа',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Максимальная длина двадцать символов',
      },
    ])
    .addField('#email', [
      { rule: 'required', errorMessage: 'Введите вашу почту' },
      { rule: 'email', errorMessage: 'Почта введена не верно' },
    ])
    .addField('#agree', [
      { rule: 'required', errorMessage: 'Согласие обязательно' },
    ])
    .onSuccess(async (event) => {
      event.preventDefault();

      const formData = {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        agree: form.querySelector('#agree').checked,
      };

      const serverUrl = form.action;

      try {
        const url = new URL(serverUrl);
        if (!url.hostname) {
          throw new Error('Некорректный адрес сервера');
        }

        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(
            `Ошибка сервера: ${
              response.status === 0
                ? 'нет ответа от сервера'
                : response.statusText
            }`
          );
        }

        // Показываем модальное окно при успешной отправке
        showModal({
          iconId: 'icon-completed',
          title: 'Благодарим за обращение!',
          message:
            'Мы получили вашу заявку и свяжемся с вами в ближайшее время',
        });
        form.reset();
      } catch (error) {
        console.error('Ошибка при отправке формы:', error);

        showModal({
          iconId: 'icon-warning',
          title: 'Не удалось отправить обращение',
          message:
            'Что-то пошло не так, попробуйте отправить форму ещё раз. Если ошибка повторится — свяжитесь со службой поддержки.',
        });
      }
    });
}

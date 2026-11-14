import { getProducts } from '../api/productsApi.js';
import { formatPriceWithCurrency } from '../utils/priceFormatter.js';

const LOCATION_NAMES = {
  moscow: 'Москва',
  orenburg: 'Оренбург',
  saintPetersburg: 'Санкт-Петербург',
};

function createText(tag, className, value) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = value;
  return node;
}

export async function initProductPage(basket) {
  const container = document.querySelector('[data-product-detail]');
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    container.append(
      createText('p', 'product-page__notice', 'Товар не выбран.')
    );
    return;
  }

  try {
    const products = await getProducts();
    const product = products.find((item) => String(item.id) === id);
    if (!product) {
      container.append(
        createText('p', 'product-page__notice', 'Товар не найден.')
      );
      return;
    }

    document.title = `${product.name} — Briaton (демо)`;
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.className = 'product-page__image';
    image.loading = 'eager';

    const info = document.createElement('div');
    info.className = 'product-page__info';
    info.append(
      createText('h1', 'product-page__title', product.name),
      createText(
        'p',
        'product-page__price',
        formatPriceWithCurrency(product.price.new)
      )
    );

    const available = Object.entries(product.availability ?? {})
      .filter(([, count]) => count > 0)
      .map(([city, count]) => `${LOCATION_NAMES[city] ?? city}: ${count} шт.`);
    info.append(
      createText(
        'p',
        'product-page__stock',
        available.length ? available.join(' · ') : 'Нет в наличии'
      ),
      createText(
        'p',
        'product-page__notice',
        'Демонстрационная карточка товара. Подробные характеристики не подключены.'
      )
    );

    const button = createText(
      'button',
      'btn btn--big product-page__button',
      'Добавить в корзину'
    );
    button.type = 'button';
    button.disabled = available.length === 0;
    button.addEventListener('click', () => {
      basket.addItem(product);
      const counter = document.querySelector('.header__user-count');
      if (counter) counter.setAttribute('aria-live', 'polite');
      button.textContent = 'Добавлено в корзину';
    });
    info.append(button);
    container.append(image, info);
  } catch (error) {
    console.error('Ошибка загрузки товара:', error);
    container.append(
      createText('p', 'product-page__notice', 'Не удалось загрузить товар.')
    );
  }
}

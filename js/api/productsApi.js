export async function getProducts() {
  const response = await fetch('./data/data.json');

  if (!response.ok) {
    throw new Error(`Ошибка загрузки товаров: ${response.status}`);
  }

  const products = await response.json();
  if (!Array.isArray(products)) {
    throw new Error('Некорректный формат каталога');
  }

  return products;
}

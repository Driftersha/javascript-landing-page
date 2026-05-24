export async function getProducts() {
  const response = await fetch('./data/data.json');

  if (!response.ok) {
    throw new Error(`Ошибка загрузки товаров: ${response.status}`);
  }

  return response.json();
}

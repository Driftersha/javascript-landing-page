export function getProducts() {
  return fetch('./data/data.json').then((response) => response.json());
}

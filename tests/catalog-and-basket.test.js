import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts } from '../js/components/filters.js';
import { sortProducts } from '../js/components/sort.js';
import { createBasketService } from '../js/services/basketService.js';

const products = [
  {
    id: 1,
    price: { new: 120 },
    type: ['pendant'],
    rating: 9,
    availability: { moscow: 2 },
  },
  {
    id: 2,
    price: { new: 80 },
    type: ['ceiling'],
    rating: 5,
    availability: { moscow: 0 },
  },
  {
    id: 3,
    price: { new: 150 },
    type: ['ceiling'],
    rating: 10,
    availability: { moscow: 3 },
  },
];

test('фильтрация по категории и наличию', () => {
  assert.deepEqual(
    filterProducts(products, ['ceiling'], true).map((item) => item.id),
    [3]
  );
  assert.equal(filterProducts(products, [], true).length, 2);
  assert.equal(filterProducts(products, [], false).length, 3);
});

test('сортировка по цене и популярности не меняет исходный массив', () => {
  assert.deepEqual(
    sortProducts([...products], 'price-min').map((item) => item.id),
    [2, 1, 3]
  );
  assert.deepEqual(
    sortProducts([...products], 'rating-max').map((item) => item.id),
    [3, 1, 2]
  );
  assert.equal(products[0].id, 1);
});

test('корзина меняет количество и сумму, а затем очищается', () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem(key) {
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
  };
  const basket = createBasketService();
  basket.addItem(products[0]);
  basket.addItem(products[0]);
  basket.addItem(products[1]);
  assert.equal(basket.getTotalQuantity(), 3);
  assert.equal(basket.getTotalPrice(), 320);
  basket.removeItem(1);
  assert.equal(basket.getTotalPrice(), 200);
  basket.clear();
  assert.deepEqual(basket.getItems(), []);
  delete globalThis.localStorage;
});

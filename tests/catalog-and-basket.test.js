import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts } from '../js/components/filters.js';
import { sortProducts } from '../js/components/sort.js';
import { createBasketService } from '../js/services/basketService.js';
import { createBasketStorage } from '../js/services/basketStorage.js';

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

function mockLocalStorage(t, initialValues = {}, failWrites = false) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const store = new Map(Object.entries(initialValues));
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => store.get(key) ?? null,
      setItem(key, value) {
        if (failWrites) throw new Error('Хранилище недоступно для записи');
        store.set(key, value);
      },
    },
  });
  t.after(() => {
    if (original) {
      Object.defineProperty(globalThis, 'localStorage', original);
    } else {
      delete globalThis.localStorage;
    }
  });
  return store;
}

test('корзина сохраняет только ID и количество, считает сумму и очищается', (t) => {
  const store = mockLocalStorage(t);
  const basket = createBasketService(products);
  basket.addItem(products[0]);
  basket.addItem(products[0]);
  basket.addItem(products[1]);
  assert.equal(basket.getTotalQuantity(), 3);
  assert.equal(basket.getTotalPrice(), 320);
  assert.deepEqual(JSON.parse(store.get('briaton:basket')), {
    version: 1,
    items: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
  });
  basket.decreaseQuantity(1);
  assert.equal(basket.getTotalPrice(), 200);
  basket.decreaseQuantity(1);
  assert.equal(basket.getTotalPrice(), 200);
  basket.addItem(products[0]);
  basket.removeItem(1);
  assert.deepEqual(basket.getItems(), [{ ...products[1], quantity: 1 }]);
  assert.equal(basket.getTotalPrice(), 80);
  basket.clear();
  assert.deepEqual(basket.getItems(), []);
});

test('корзина безопасно игнорирует повреждённые и несовместимые версии', (t) => {
  const key = 'briaton:basket';
  const store = mockLocalStorage(t, {
    basketItems: JSON.stringify([{ ...products[0], quantity: 2 }]),
  });
  const basket = createBasketService(products);
  for (const raw of [
    '{',
    '{}',
    'null',
    '[]',
    '{"version":1,"items":{}}',
    '{"version":2,"items":[{"id":1,"quantity":3}]}',
  ]) {
    store.set(key, raw);
    assert.deepEqual(basket.getItems(), []);
    assert.equal(basket.getTotalPrice(), 0);
    assert.equal(store.get(key), raw);
  }
});

test('корзина восстанавливает известные товары по текущей цене', (t) => {
  const store = mockLocalStorage(t, {
    'briaton:basket': JSON.stringify({
      version: 1,
      items: [
        { id: 1, quantity: 2, name: 'Старое название', price: { new: 1 } },
        { id: 1, quantity: 4 },
        { id: 2, quantity: -1 },
        { id: 3, quantity: '2' },
        { id: 999, quantity: 1 },
        null,
      ],
    }),
  });
  const basket = createBasketService(products);
  assert.deepEqual(basket.getItems(), [{ ...products[0], quantity: 2 }]);
  assert.equal(basket.getTotalPrice(), 240);
  assert.equal(basket.addItem({ id: 999 }), false);
  assert.equal(basket.addItem({ id: 2, price: { new: 1 } }), true);
  assert.equal(basket.getTotalPrice(), 320);
  assert.deepEqual(JSON.parse(store.get('briaton:basket')).items, [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ]);
});

test('старые записи Briaton не попадают в корзину другого бренда', (t) => {
  const legacy = JSON.stringify([
    { id: 1, quantity: 2, price: { new: 1 } },
    { id: 999, quantity: 1 },
  ]);
  const store = mockLocalStorage(t, { basketItems: legacy });
  const briaton = createBasketService(products);
  const homeLiving = createBasketService(
    products,
    createBasketStorage('home-living')
  );
  assert.equal(briaton.getTotalPrice(), 240);
  assert.deepEqual(homeLiving.getItems(), []);
  homeLiving.addItem(products[0]);
  assert.equal(homeLiving.getTotalQuantity(), 1);
  assert.equal(briaton.getTotalQuantity(), 2);

  briaton.clear();
  assert.deepEqual(createBasketService(products).getItems(), []);
  assert.equal(homeLiving.getTotalQuantity(), 1);
  assert.equal(store.get('basketItems'), legacy);
});

test('при недоступной записи корзина работает до перезагрузки', (t) => {
  mockLocalStorage(t, {}, true);
  const basket = createBasketService(products);
  basket.addItem(products[0]);
  assert.equal(basket.getTotalQuantity(), 1);
  assert.equal(basket.getTotalPrice(), 120);
  basket.clear();
  assert.deepEqual(basket.getItems(), []);
});

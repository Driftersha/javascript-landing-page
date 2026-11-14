import { createBasketStorage } from './basketStorage.js';

export function createBasketService(products, storage = createBasketStorage()) {
  const productsById = new Map(
    products.map((product) => [product.id, product])
  );

  function getEntries() {
    return storage.read().filter((entry) => productsById.has(entry.id));
  }

  return {
    getItems() {
      return getEntries().map(({ id, quantity }) => ({
        ...productsById.get(id),
        quantity,
      }));
    },

    addItem(product) {
      const { id } = product;
      if (!productsById.has(id)) return false;

      const entries = getEntries();
      const existing = entries.find((entry) => entry.id === id);
      if (existing?.quantity === Number.MAX_SAFE_INTEGER) return false;
      if (existing) {
        existing.quantity += 1;
      } else {
        entries.push({ id, quantity: 1 });
      }

      storage.write(entries);
      return true;
    },

    removeItem(productId) {
      const entries = getEntries();
      const index = entries.findIndex((entry) => entry.id === productId);
      if (index === -1) return;

      if (entries[index].quantity > 1) {
        entries[index].quantity -= 1;
      } else {
        entries.splice(index, 1);
      }

      storage.write(entries);
    },

    clear() {
      storage.write([]);
    },

    getTotalPrice() {
      return getEntries().reduce(
        (sum, { id, quantity }) =>
          sum + productsById.get(id).price.new * quantity,
        0
      );
    },

    getTotalQuantity() {
      return getEntries().reduce((sum, { quantity }) => sum + quantity, 0);
    },
  };
}

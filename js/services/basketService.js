import {
  clearBasketItems,
  getBasketItems,
  setBasketItems,
} from './basketStorage.js';

export function createBasketService() {
  return {
    getItems() {
      return getBasketItems();
    },

    addItem(product) {
      const items = getBasketItems();
      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.push({ ...product, quantity: 1 });
      }

      setBasketItems(items);
    },

    removeItem(productId) {
      const items = getBasketItems();
      const index = items.findIndex((item) => item.id === productId);

      if (index === -1) return;

      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
      } else {
        items.splice(index, 1);
      }

      setBasketItems(items);
    },

    clear() {
      clearBasketItems();
    },

    getTotalPrice() {
      return getBasketItems().reduce((sum, product) => {
        return sum + product.price.new * product.quantity;
      }, 0);
    },

    getTotalQuantity() {
      return getBasketItems().reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);
    },
  };
}

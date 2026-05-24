import Basket from '../components/Basket.js';
import { initCheckoutValidation } from '../components/formValidation.js';

export function initCheckoutPage() {
  const basket = new Basket();

  initCheckoutValidation(basket);
}

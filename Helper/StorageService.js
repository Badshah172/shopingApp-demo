import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartManager } from './CartManager';

const CART_KEY = 'user_cart';

export const StorageService = {
  // --- CART FUNCTIONS ---
  getCart: async () => {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : {};
  },

  updateCart: async (productId, delta) => {
    const cart = await StorageService.getCart();
    const currentQty = cart[productId] || 0;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      delete cart[productId];
    } else {
      cart[productId] = newQty;
    }

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    cartManager.notify(); // Sab screens ko batao ke cart change ho gaya
    return cart;
  },

};
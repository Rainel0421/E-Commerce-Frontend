// frontend/src/api/cart.api.js
import api from './axios.config';

// Convierte los items del CartContext (shape de localStorage) al shape que espera el backend
const toBackendItems = (cartItems) =>
  cartItems.map((i) => ({ productId: i.id, quantity: i.quantity }));

// POST /api/cart/summary -> valida precios y stock reales contra la DB
export const getCartSummary = async (cartItems) => {
  const { data } = await api.post('/cart/summary', {
    items: toBackendItems(cartItems),
  });
  return data.data; // { items, total, issues, valid }
};
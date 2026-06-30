// frontend/src/api/orders.api.js
import api from './axios.config';

const toBackendItems = (cartItems) =>
  cartItems.map((i) => ({ productId: i.id, quantity: i.quantity }));

// POST /api/orders/checkout -> requiere estar logueado (el token va en el header automáticamente)
export const createCheckout = async (cartItems) => {
  const { data } = await api.post('/orders/checkout', {
    items: toBackendItems(cartItems),
  });
  return data.data; // { orderId, checkoutUrl }
};

export const getMyOrders = async () => {
  const { data } = await api.get('/orders');
  return data.data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

// --- Rutas de ADMIN (requieren estar logueado con rol ADMIN) ---
export const getAllOrders = async () => {
  const { data } = await api.get('/orders/all');
  return data.data;
};
// Retoma el pago de una orden PENDING ya existente
export const retryPayment = async (orderId) => {
  const { data } = await api.post(`/orders/${orderId}/retry-payment`);
  return data.data; // { orderId, checkoutUrl }
};
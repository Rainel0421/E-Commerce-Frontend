/* eslint-disable react-refresh/only-export-components */
// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'cart_items';

export function CartProvider({ children }) {
  // Inicializamos leyendo localStorage, así el carrito sobrevive a un refresh de página
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cada vez que cambian los items, los persistimos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: newQuantity } : i
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
      )
    );
  };

 // cart.Context.jsx
const clearCart = useCallback(() => {
  setItems([]);
}, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook: evita que cada componente importe useContext + CartContext por separado
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
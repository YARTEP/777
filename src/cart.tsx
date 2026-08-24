import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { CartItem, Product } from './types';
import { getCart, saveCart, getProducts } from './storage';

interface CartContextValue {
  cart: CartItem[];
  products: Product[];
  addToCart: (productId: string, quantity: number, unit: 'tons' | 'meters') => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [products] = useState<Product[]>(() => getProducts());

  useEffect(() => saveCart(cart), [cart]);

  const addToCart = useCallback((productId: string, quantity: number, unit: 'tons' | 'meters') => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing && existing.unit === unit) {
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i));
      }
      if (existing) {
        return prev.map((i) => (i.productId === productId ? { ...i, quantity, unit } : i));
      }
      return [...prev, { productId, quantity, unit }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => quantity <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, products, addToCart, updateQuantity, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

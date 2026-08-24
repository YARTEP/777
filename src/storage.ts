import { Product, CartItem, Order } from './types';
import { SEED_PRODUCTS } from './seed';

const PRODUCTS_KEY = 'yartep_products';
const CART_KEY = 'yartep_cart';
const ORDERS_KEY = 'yartep_orders';
const ADMIN_KEY = 'isAdmin';
const COOKIE_KEY = 'cookie_consent';

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(raw) as Product[];
  } catch {
    return SEED_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getIsAdmin(): boolean {
  return localStorage.getItem(ADMIN_KEY) === 'true';
}

export function setIsAdmin(value: boolean): void {
  if (value) localStorage.setItem(ADMIN_KEY, 'true');
  else localStorage.removeItem(ADMIN_KEY);
}

export function getCookieConsent(): boolean {
  return localStorage.getItem(COOKIE_KEY) === 'true';
}

export function setCookieConsent(value: boolean): void {
  if (value) localStorage.setItem(COOKIE_KEY, 'true');
  else localStorage.removeItem(COOKIE_KEY);
}

export function newId(): string {
  return `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

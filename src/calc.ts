import { Product, Unit } from './types';

export function calcItemTotal(product: Product, quantity: number, unit: Unit): number {
  if (unit === 'tons') {
    return quantity * product.price;
  }
  return (quantity * product.weightPerMeter / 1000) * product.price;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Math.round(value)) + ' ₽';
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

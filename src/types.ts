export type ProductType =
  | 'Труба круглая'
  | 'Труба квадратная'
  | 'Труба прямоугольная'
  | 'Уголок'
  | 'Швеллер'
  | 'Арматура'
  | 'Двутавр'
  | 'Егоза'
  | 'Сетка плетёная'
  | 'Сетка сварная'
  | 'Профнастил оцинкованный'
  | 'Услуга';

export type SteelMark = 'Ст3' | '09Г2С' | 'А500С' | '10ХСНД' | '12Х18Н10Т';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  steelMark: SteelMark;
  thickness: number;
  length: number;
  price: number;
  weightPerMeter: number;
}

export type Unit = 'tons' | 'meters';

export interface CartItem {
  productId: string;
  quantity: number;
  unit: Unit;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: OrderCustomer;
  total: number;
  createdAt: string;
}

export const PRODUCT_TYPES: ProductType[] = [
  'Труба круглая',
  'Труба квадратная',
  'Труба прямоугольная',
  'Уголок',
  'Швеллер',
  'Арматура',
  'Двутавр',
  'Егоза',
  'Сетка плетёная',
  'Сетка сварная',
  'Профнастил оцинкованный',
  'Услуга',
];

export const STEEL_MARKS: SteelMark[] = ['Ст3', '09Г2С', 'А500С', '10ХСНД', '12Х18Н10Т'];

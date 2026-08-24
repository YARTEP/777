import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Product, CartItem, Order, Unit } from './types'
import { SEED_PRODUCTS } from './seed'

const PRODUCTS_KEY = 'yartep_products'
const CART_KEY = 'yartep_cart'
const ORDERS_KEY = 'yartep_orders'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

interface StoreContextValue {
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  addProduct: (p: Omit<Product, 'id'>) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: number) => void
  addToCart: (productId: number, unit: Unit, quantity: number) => void
  updateCartItem: (productId: number, unit: Unit, quantity: number) => void
  removeFromCart: (productId: number, unit: Unit) => void
  clearCart: () => void
  addOrder: (o: Order) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const existing = read<Product[] | null>(PRODUCTS_KEY, null)
    if (!existing || existing.length === 0) {
      write(PRODUCTS_KEY, SEED_PRODUCTS)
      setProducts(SEED_PRODUCTS)
    } else {
      setProducts(existing)
    }
    setCart(read<CartItem[]>(CART_KEY, []))
    setOrders(read<Order[]>(ORDERS_KEY, []))
  }, [])

  const persistCart = useCallback((next: CartItem[]) => {
    setCart(next)
    write(CART_KEY, next)
  }, [])

  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    setProducts((prev) => {
      const id = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1
      const next = [...prev, { ...p, id }]
      write(PRODUCTS_KEY, next)
      return next
    })
  }, [])

  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => {
      const next = prev.map((x) => (x.id === p.id ? p : x))
      write(PRODUCTS_KEY, next)
      return next
    })
  }, [])

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => {
      const next = prev.filter((x) => x.id !== id)
      write(PRODUCTS_KEY, next)
      return next
    })
  }, [])

  const addToCart = useCallback((productId: number, unit: Unit, quantity: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.productId === productId && c.unit === unit)
      let next: CartItem[]
      if (idx >= 0) {
        next = prev.map((c, i) => (i === idx ? { ...c, quantity: c.quantity + quantity } : c))
      } else {
        next = [...prev, { productId, unit, quantity }]
      }
      write(CART_KEY, next)
      return next
    })
  }, [])

  const updateCartItem = useCallback((productId: number, unit: Unit, quantity: number) => {
    setCart((prev) => {
      const next = prev.map((c) => (c.productId === productId && c.unit === unit ? { ...c, quantity } : c))
      write(CART_KEY, next)
      return next
    })
  }, [])

  const removeFromCart = useCallback((productId: number, unit: Unit) => {
    setCart((prev) => {
      const next = prev.filter((c) => !(c.productId === productId && c.unit === unit))
      write(CART_KEY, next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => persistCart([]), [persistCart])

  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => {
      const next = [o, ...prev]
      write(ORDERS_KEY, next)
      return next
    })
  }, [])

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status } : o))
      write(ORDERS_KEY, next)
      return next
    })
  }, [])

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

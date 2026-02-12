import { createContext, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react"
import { type Producto } from "../models/ProductoModel"

export interface CartItem extends Producto {
   cantidad: number
   subtotal: number
}

interface CartContextProps {
   cart: CartItem[]
   addToCart: (product: Producto, quantity: number) => void
   removeFromCart: (productId: number) => void
   clearCart: () => void
   total: number
   cartVisible: boolean
   setCartVisible: (visible: boolean) => void
   toggleCart: () => void
   registerCheckoutHandler: (handler: (() => void) | null) => void
   executeCheckout: () => void
   hasCheckoutHandler: boolean
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
   const [cart, setCart] = useState<CartItem[]>([])
   const [cartVisible, setCartVisible] = useState(false)
   const [hasCheckoutHandler, setHasCheckoutHandler] = useState(false)
   const checkoutHandlerRef = useRef<(() => void) | null>(null)

   const toggleCart = useCallback(() => {
      setCartVisible(prev => !prev)
   }, [])

   const registerCheckoutHandler = useCallback((handler: (() => void) | null) => {
      checkoutHandlerRef.current = handler
      setHasCheckoutHandler(handler !== null)
   }, [])

   const executeCheckout = useCallback(() => {
      if (checkoutHandlerRef.current) {
         checkoutHandlerRef.current()
      }
   }, [])

   const addToCart = (product: Producto, quantity: number) => {
      setCart(prev => {
         const existing = prev.find(item => item.id === product.id)
         if (existing) {
            return prev.map(item =>
               item.id === product.id
                  ? { ...item, cantidad: item.cantidad + quantity, subtotal: (item.cantidad + quantity) * item.precio }
                  : item
            )
         } else {
            return [...prev, { ...product, cantidad: quantity, subtotal: quantity * product.precio }]
         }
      })
   }

   const removeFromCart = (productId: number) => {
      setCart(prev => prev.filter(item => item.id !== productId))
   }

   const clearCart = () => {
      setCart([])
   }

   const total = useMemo(() => cart.reduce((acc, item) => acc + item.subtotal, 0), [cart])

   const value = useMemo(() => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      total,
      cartVisible,
      setCartVisible,
      toggleCart,
      registerCheckoutHandler,
      executeCheckout,
      hasCheckoutHandler
   }), [cart, total, cartVisible, toggleCart, registerCheckoutHandler, executeCheckout, hasCheckoutHandler])

   return (
      <CartContext.Provider value={value}>
         {children}
      </CartContext.Provider>
   )
}

export const useCart = () => {
   const context = useContext(CartContext)
   if (!context) {
      throw new Error("useCart must be used within a CartProvider")
   }
   return context
}


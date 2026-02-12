import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import { type CartItemModel } from "../models/CartItemModel"
import { type ProductoModel } from "../models/ProductoModel"
import { CartContext } from "./CartContext"

type Props = {
   children: ReactNode
}

export const CartProvider = ({ children }: Props) => {
   const [cart, setCart] = useState<CartItemModel[]>([])
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

   const addToCart = (product: ProductoModel, quantity: number) => {
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
      total,
      cartVisible,
      hasCheckoutHandler,
      addToCart,
      removeFromCart,
      clearCart,
      setCartVisible,
      toggleCart,
      registerCheckoutHandler,
      executeCheckout
   }), [cart, total, cartVisible, toggleCart, registerCheckoutHandler, executeCheckout, hasCheckoutHandler])

   return (
      <CartContext.Provider value={value}>
         {children}
      </CartContext.Provider>
   )
}

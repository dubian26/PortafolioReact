import { createContext, useContext } from "react"
import { type CartItemModel } from "../models/CartItemModel"
import { type ProductoModel } from "../models/ProductoModel"

interface CartContextProps {
   cart: CartItemModel[]
   total: number
   cartVisible: boolean
   savingCart: boolean
   hasCheckoutHandler: boolean
   addToCart: (product: ProductoModel, quantity: number) => void
   removeFromCart: (productId: number) => void
   clearCart: () => void
   setCartVisible: (visible: boolean) => void
   setSavingCart: (savingCart: boolean) => void
   toggleCart: () => void
   registerCheckoutHandler: (handler: (() => void) | null) => void
   executeCheckout: () => void
}

export const CartContext = createContext<CartContextProps | undefined>(undefined)

export const useCart = () => {
   const context = useContext(CartContext)
   if (!context) throw new Error("useCart no ha sido definido en CartProvider")
   return context
}

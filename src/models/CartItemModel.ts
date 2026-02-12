import type { ProductoModel } from "./ProductoModel"

export interface CartItemModel extends ProductoModel {
   cantidad: number
   subtotal: number
}

import { type OrdenItem } from "./OrdenModel"

export interface Factura {
   id?: number
   ordenId: number
   numeroFactura: string
   fecha: Date
   clienteNombre: string
   clienteNit?: string
   total: number
   items: OrdenItem[]
}

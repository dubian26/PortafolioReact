export type EstadoOrden = "Pendiente" | "Confirmada" | "Enviada" | "Cancelada"

export interface OrdenItem {
   productoId: number
   productoNombre: string
   cantidad: number
   precioUnitario: number
   subtotal: number
}

export interface Orden {
   id?: number
   usuarioId: string
   fecha: Date
   total: number
   estado: EstadoOrden
   items: OrdenItem[]
}

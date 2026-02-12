import { BaseRepository } from "../db/BaseRepository"
import { dbProvider } from "../db/db.config"
import { type ProductoModel } from "../models/ProductoModel"

class ProductoRepository extends BaseRepository<ProductoModel> {
   constructor() {
      super(dbProvider, "productos")
   }

   async buscarPorCodigo(codigo: string): Promise<ProductoModel | undefined> {
      const store = await this.db.getStore(this.storeName)
      const index = store.index("codigo")
      return new Promise((resolve, reject) => {
         const request = index.get(codigo)
         request.onsuccess = () => resolve(request.result as ProductoModel)
         request.onerror = () => reject(request.error)
      })
   }

   async seedDefaultProducts(): Promise<void> {
      const currentProducts = await this.listarTodos()
      if (currentProducts.length > 0) return

      const defaultProducts: ProductoModel[] = [
         { codigo: "LPT-001", nombre: "Laptop Pro", precio: 1200, stock: 15, categoria: "Electrónica", descripcion: "Potente laptop para profesionales" },
         { codigo: "MON-400", nombre: "Monitor 4K", precio: 350, stock: 20, categoria: "Electrónica", descripcion: "Monitor de 27 pulgadas resolución 4K" },
         { codigo: "TEC-MEC", nombre: "Teclado Mecánico", precio: 80, stock: 50, categoria: "Accesorios", descripcion: "Teclado RGB con switches blue" },
         { codigo: "MOU-GAM", nombre: "Mouse Gamer", precio: 45, stock: 100, categoria: "Accesorios", descripcion: "Mouse ergonómico 16000 DPI" },
         { codigo: "AUD-WLS", nombre: "Audífonos Wireless", precio: 120, stock: 30, categoria: "Audio", descripcion: "Cancelación de ruido activa" }
      ]

      for (const prod of defaultProducts) {
         await this.agregar(prod)
      }
   }
}

export const productoRepository = new ProductoRepository()

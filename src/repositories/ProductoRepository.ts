import { convert } from "../appconfig/Convert"
import { type BaseDB } from "../db/BaseDB"
import { dbProvider } from "../db/db.config"
import { type ConfigModel } from "../models/ConfigModel"
import { type ProductoModel } from "../models/ProductoModel"
import { authService } from "../services/AuthService"

class ProductoRepository {
   private db: BaseDB
   private storeName: string
   private mockDelayMs: number

   constructor() {
      this.db = dbProvider
      this.storeName = "productos"
      this.mockDelayMs = 0
   }

   asignarConfig(config: ConfigModel) {
      this.mockDelayMs = convert.toSeconds(config.mockRequestDelay) * 1000
   }

   async agregar(item: ProductoModel): Promise<number | string> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.add(item)
         request.onsuccess = () => resolve(request.result as number | string)
         request.onerror = () => reject(request.error)
      })
   }

   async listarTodos(): Promise<ProductoModel[]> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.getAll()
         request.onsuccess = () => resolve(request.result as ProductoModel[])
         request.onerror = () => reject(request.error)
      })
   }

   async buscarPorId(id: number | string): Promise<ProductoModel | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.get(id)
         request.onsuccess = () => resolve(request.result as ProductoModel)
         request.onerror = () => reject(request.error)
      })
   }

   async actualizar(item: ProductoModel): Promise<void> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.put(item)
         request.onsuccess = () => resolve()
         request.onerror = () => reject(request.error)
      })
   }

   async eliminar(id: number | string): Promise<void> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.delete(id)
         request.onsuccess = () => resolve()
         request.onerror = () => reject(request.error)
      })
   }

   async buscarPorCodigo(codigo: string): Promise<ProductoModel | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      const index = store.index("codigo")
      return new Promise((resolve, reject) => {
         const request = index.get(codigo)
         request.onsuccess = () => resolve(request.result as ProductoModel)
         request.onerror = () => reject(request.error)
      })
   }

   async seedDefaultProducts(): Promise<void> {
      // No delay for seeding as it happens at startup and internal check is faster
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

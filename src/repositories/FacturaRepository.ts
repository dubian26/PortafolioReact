import { convert } from "../appconfig/Convert"
import { type BaseDB } from "../db/BaseDB"
import { dbProvider } from "../db/db.config"
import { type ConfigModel } from "../models/ConfigModel"
import { type Factura } from "../models/FacturaModel"
import { authService } from "../services/AuthService"

class FacturaRepository {
   private db: BaseDB
   private storeName: string
   private mockDelayMs: number

   constructor() {
      this.db = dbProvider
      this.storeName = "facturas"
      this.mockDelayMs = 0
   }

   asignarConfig(config: ConfigModel) {
      this.mockDelayMs = convert.toSeconds(config.mockRequestDelay) * 1000
   }

   async agregar(item: Factura): Promise<number | string> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.add(item)
         request.onsuccess = () => resolve(request.result as number | string)
         request.onerror = () => reject(request.error)
      })
   }

   async listarTodos(): Promise<Factura[]> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.getAll()
         request.onsuccess = () => resolve(request.result as Factura[])
         request.onerror = () => reject(request.error)
      })
   }

   async buscarPorId(id: number | string): Promise<Factura | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.get(id)
         request.onsuccess = () => resolve(request.result as Factura)
         request.onerror = () => reject(request.error)
      })
   }

   async actualizar(item: Factura): Promise<void> {
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

   async buscarPorOrdenId(ordenId: number): Promise<Factura | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      const index = store.index("ordenId")
      return new Promise((resolve, reject) => {
         const request = index.get(ordenId)
         request.onsuccess = () => resolve(request.result as Factura)
         request.onerror = () => reject(request.error)
      })
   }
}

export const facturaRepository = new FacturaRepository()

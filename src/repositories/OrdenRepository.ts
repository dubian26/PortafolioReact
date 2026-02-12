import { convert } from "../appconfig/Convert"
import { type BaseDB } from "../db/BaseDB"
import { dbProvider } from "../db/db.config"
import { type ConfigModel } from "../models/ConfigModel"
import { type Orden } from "../models/OrdenModel"
import { authService } from "../services/AuthService"

class OrdenRepository {
   private db: BaseDB
   private storeName: string
   private mockDelayMs: number

   constructor() {
      this.db = dbProvider
      this.storeName = "ordenes"
      this.mockDelayMs = 0
   }

   asignarConfig(config: ConfigModel) {
      this.mockDelayMs = convert.toSeconds(config.mockRequestDelay) * 1000
   }

   async agregar(item: Orden): Promise<number | string> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.add(item)
         request.onsuccess = () => resolve(request.result as number | string)
         request.onerror = () => reject(request.error)
      })
   }

   async listarTodos(): Promise<Orden[]> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.getAll()
         request.onsuccess = () => resolve(request.result as Orden[])
         request.onerror = () => reject(request.error)
      })
   }

   async buscarPorId(id: number | string): Promise<Orden | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.get(id)
         request.onsuccess = () => resolve(request.result as Orden)
         request.onerror = () => reject(request.error)
      })
   }

   async actualizar(item: Orden): Promise<void> {
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

   async listarPorUsuario(usuarioId: number): Promise<Orden[]> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      const index = store.index("usuarioId")
      return new Promise((resolve, reject) => {
         const request = index.getAll(usuarioId)
         request.onsuccess = () => resolve(request.result as Orden[])
         request.onerror = () => reject(request.error)
      })
   }
}

export const ordenRepository = new OrdenRepository()

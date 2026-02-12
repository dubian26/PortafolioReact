import { BaseRepository } from "../db/BaseRepository"
import { dbProvider } from "../db/db.config"
import { type Orden } from "../models/OrdenModel"

class OrdenRepository extends BaseRepository<Orden> {
   constructor() {
      super(dbProvider, "ordenes")
   }

   async listarPorUsuario(usuarioId: number): Promise<Orden[]> {
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

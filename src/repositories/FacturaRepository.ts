import { BaseRepository } from "../db/BaseRepository"
import { dbProvider } from "../db/db.config"
import { type Factura } from "../models/FacturaModel"

class FacturaRepository extends BaseRepository<Factura> {
   constructor() {
      super(dbProvider, "facturas")
   }

   async buscarPorOrdenId(ordenId: number): Promise<Factura | undefined> {
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

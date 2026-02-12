import { BaseRepository } from "../db/BaseRepository"
import { dbProvider } from "../db/db.config"
import { type Producto } from "../models/ProductoModel"

class ProductoRepository extends BaseRepository<Producto> {
   constructor() {
      super(dbProvider, "productos")
   }

   async buscarPorCodigo(codigo: string): Promise<Producto | undefined> {
      const store = await this.db.getStore(this.storeName)
      const index = store.index("codigo")
      return new Promise((resolve, reject) => {
         const request = index.get(codigo)
         request.onsuccess = () => resolve(request.result as Producto)
         request.onerror = () => reject(request.error)
      })
   }
}

export const productoRepository = new ProductoRepository()

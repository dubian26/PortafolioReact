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
}

export const productoRepository = new ProductoRepository()

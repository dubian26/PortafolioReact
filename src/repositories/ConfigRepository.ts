import { convert } from "../appconfig/Convert"
import { type BaseDB } from "../db/BaseDB"
import { dbProvider } from "../db/db.config"
import { type ConfigModel } from "../models/ConfigModel"

class ConfigRepository {
   private db: BaseDB
   private storeName: string
   private mockDelayMs: number

   constructor() {
      this.db = dbProvider
      this.storeName = "config"
      this.mockDelayMs = 0
   }

   asignarConfig(config: ConfigModel) {
      this.mockDelayMs = convert.toSeconds(config.mockRequestDelay) * 1000
   }

   async obtener(): Promise<ConfigModel | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         // Assuming we only have one config record, we can try to get the first one
         // or specific ID if we enforce it. For now, let's use getAll and take the first.
         const request = store.getAll()
         request.onsuccess = () => {
            const result = request.result as ConfigModel[]
            resolve(result.length > 0 ? result[0] : undefined)
         }
         request.onerror = () => reject(request.error)
      })
   }

   async guardar(config: ConfigModel): Promise<void> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.put(config)
         request.onsuccess = () => resolve()
         request.onerror = () => reject(request.error)
      })
   }
}

export const configRepository = new ConfigRepository()

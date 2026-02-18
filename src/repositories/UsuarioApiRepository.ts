import { API_URL } from "../appconfig/Constants"
import { convert } from "../appconfig/Convert"
import { FetchUtility } from "../appconfig/FetchUtility"
import { type BaseDB } from "../db/BaseDB"
import { dbProvider } from "../db/db.config"
import { type ConfigModel } from "../models/ConfigModel"
import type { IdResult } from "../models/IdResult"
import { type TokenModel } from "../models/TokenModel"
import { type UsuarioModel } from "../models/UsuarioModel"
import { authService } from "../services/AuthService"

export class UsuarioApiRepository {
   private db: BaseDB
   private storeName: string
   private config: ConfigModel | undefined
   private mockDelayMs: number

   constructor() {
      this.db = dbProvider
      this.storeName = "usuarios"
      this.mockDelayMs = 0
   }

   asignarConfig(config: ConfigModel) {
      this.config = config
      this.mockDelayMs = convert.toSeconds(config.mockRequestDelay) * 1000
   }

   async buscarPorEmail(email: string): Promise<UsuarioModel | undefined> {
      const url = `${API_URL}/buscar-usuario-por-email`
      const options = FetchUtility.preRequest({ email })
      const response = await fetch(url, options)
      await FetchUtility.postRequest(response, "buscarPorEmail")
      return await FetchUtility.getResponseData<UsuarioModel>(response)
   }

   async buscarPorId(id: number | string): Promise<UsuarioModel | undefined> {
      const url = `${API_URL}/buscar-usuario-por-id`
      const options = FetchUtility.preRequest({ id })
      const response = await fetch(url, options)
      await FetchUtility.postRequest(response, "buscarPorId")
      return await FetchUtility.getResponseData<UsuarioModel>(response)
   }

   async autenticar(email: string, password: string): Promise<TokenModel | undefined> {
      const url = `${API_URL}/login`
      const options = FetchUtility.preRequest({ email, password })
      const response = await fetch(url, options)
      await FetchUtility.postRequest(response, "autenticar")
      return await FetchUtility.getResponseData<TokenModel>(response)
   }

   async listarTodos(): Promise<UsuarioModel[]> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.getAll()
         request.onsuccess = () => resolve(request.result as UsuarioModel[])
         request.onerror = () => reject(request.error)
      })
   }

   async agregar(item: UsuarioModel): Promise<number | string> {
      const url = `${API_URL}/crear-usuario-cliente`
      const options = FetchUtility.preRequest(item)
      const response = await fetch(url, options)
      await FetchUtility.postRequest(response, "crear-usuario-cliente")
      const data = await FetchUtility.getResponseData<IdResult>(response)
      return data?.id ?? "0"
   }

   async actualizar(item: UsuarioModel): Promise<void> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.put(item)
         request.onsuccess = () => resolve()
         request.onerror = () => reject(request.error)
      })
   }
}
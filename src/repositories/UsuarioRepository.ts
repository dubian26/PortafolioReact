import { convert } from "../appconfig/Convert"
import { type BaseDB } from "../db/BaseDB"
import { dbProvider } from "../db/db.config"
import { type ConfigModel } from "../models/ConfigModel"
import { type TokenModel } from "../models/TokenModel"
import { type UsuarioModel } from "../models/UsuarioModel"
import { authService } from "../services/AuthService"

class UsuarioRepository {
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
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken() // me aseguro que accessToken sea vigente
      const store = await this.db.getStore(this.storeName)
      const index = store.index("email")
      return new Promise((resolve, reject) => {
         const request = index.get(email)
         request.onsuccess = () => resolve(request.result as UsuarioModel)
         request.onerror = () => reject(request.error)
      })
   }

   async buscarPorId(id: number | string): Promise<UsuarioModel | undefined> {
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.get(id)
         request.onsuccess = () => resolve(request.result as UsuarioModel)
         request.onerror = () => reject(request.error)
      })
   }

   async autenticar(email: string, password: string): Promise<TokenModel | undefined> {
      // Simular autenticacion:
      // este metodo en produccion tendria que consumir un end-point
      // que se encargaria de validar la autenticidad del usuario
      // y generar un accessToken y refreshToken
      const usuario = await this.buscarPorEmail(email)
      if (!usuario) return undefined
      if (usuario.password !== password) return undefined

      const accessToken = await authService.generarToken({
         id: usuario.id || 0,
         tipo: "access",
         nombre: usuario.nombre,
         email: usuario.email,
         rol: "admin",
         expTime: this.config?.expAccessToken || "15m",
         exp: 0
      })

      const refreshToken = await authService.generarToken({
         id: usuario.id || 0,
         tipo: "refresh",
         nombre: usuario.nombre,
         email: usuario.email,
         rol: "admin",
         expTime: this.config?.expRefreshToken || "1d",
         exp: 0
      })

      return {
         accessToken,
         refreshToken
      }
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
      await new Promise(r => setTimeout(r, this.mockDelayMs))
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.add(item)
         request.onsuccess = () => resolve(request.result as number | string)
         request.onerror = () => reject(request.error)
      })
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

export const usuarioRepository = new UsuarioRepository()

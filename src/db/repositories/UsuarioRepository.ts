import { type TokenModel } from "../../models/TokenModel"
import { type UsuarioModel } from "../../models/UsuarioModel"
import { authService } from "../../services/AuthService"
import { type BaseDB } from "../core/BaseDB"
import { dbProvider } from "../db.config"

class UsuarioRepository {
   protected db: BaseDB
   protected storeName: string

   constructor() {
      this.db = dbProvider
      this.storeName = "usuarios"
   }

   async buscarPorEmail(email: string): Promise<UsuarioModel | undefined> {
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
         exp: 0
      })

      const refreshToken = await authService.generarToken({
         id: usuario.id || 0,
         tipo: "refresh",
         nombre: usuario.nombre,
         email: usuario.email,
         exp: 0
      })

      return {
         accessToken,
         refreshToken
      }
   }

   async listarTodos(): Promise<UsuarioModel[]> {
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName)
      return new Promise((resolve, reject) => {
         const request = store.getAll()
         request.onsuccess = () => resolve(request.result as UsuarioModel[])
         request.onerror = () => reject(request.error)
      })
   }

   async agregar(item: UsuarioModel): Promise<number | string> {
      await authService.renovarToken()
      const store = await this.db.getStore(this.storeName, "readwrite")
      return new Promise((resolve, reject) => {
         const request = store.add(item)
         request.onsuccess = () => resolve(request.result as number | string)
         request.onerror = () => reject(request.error)
      })
   }

   async actualizar(item: UsuarioModel): Promise<void> {
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

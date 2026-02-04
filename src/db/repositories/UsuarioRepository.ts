import { type TokenModel } from "../../models/TokenModel"
import { type UsuarioModel } from "../../models/UsuarioModel"
import { authService } from "../../services/AuthService"
import { BaseRepository } from "../core/BaseRepository"
import { dbProvider } from "../db.config"

class UsuarioRepository extends BaseRepository<UsuarioModel> {
   constructor() {
      super(dbProvider, "usuarios")
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
}

export const usuarioRepository = new UsuarioRepository()

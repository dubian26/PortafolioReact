import { type UsuarioModel } from "../../models/UsuarioModel"
import { authService } from "../../services/AuthService"
import { BaseRepository } from "../core/BaseRepository"
import { dbProvider } from "../db.config"

class UsuarioRepository extends BaseRepository<UsuarioModel> {
   constructor() {
      super(dbProvider, "usuarios")
   }

   async buscarPorEmail(email: string): Promise<UsuarioModel | undefined> {
      const store = await this.db.getStore(this.storeName)
      const index = store.index("email")
      return new Promise((resolve, reject) => {
         const request = index.get(email)
         request.onsuccess = () => resolve(request.result as UsuarioModel)
         request.onerror = () => reject(request.error)
      })
   }

   async autenticar(email: string, password: string): Promise<string | undefined> {
      const usuario = await this.buscarPorEmail(email)
      if (!usuario) return undefined
      if (usuario.password !== password) return undefined

      const token = await authService.generarToken({
         id: usuario.id || 0,
         nombre: usuario.nombre,
         email: usuario.email
      })

      return token
   }
}

export const usuarioRepository = new UsuarioRepository()

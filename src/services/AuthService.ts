import { SignJWT, jwtVerify } from "jose"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"

/** Simular autenticación JSON Web Tokens (JWT). **/
class AuthService {
   private secret: Uint8Array

   constructor() {
      this.secret = new TextEncoder().encode(
         "esta-es-una-llave-secreta-para-simulacion-123456789")
   }

   async generarToken(params: InfoUsuaModel) {
      const jwt = await new SignJWT({ ...params })
         .setProtectedHeader({ alg: "HS256" })
         .setIssuedAt()
         .setExpirationTime(params.expTime)
         .sign(this.secret)

      return jwt
   }

   async verificarToken(token: string) {
      if (!token) return null

      try {
         const { payload } = await jwtVerify(token, this.secret)
         return payload as unknown as InfoUsuaModel
      } catch {
         return null
      }
   }

   private async obtenerToken(): Promise<string | undefined> {
      // Simular refresco de token:
      // este metodo en produccion tendria accessToken y refreshToken 
      // en readOnly cookies y no en sessionStorage
      // el end-point se encargaria de validar la autenticidad del refreshToken
      // y generar un nuevo accessToken
      const accessToken = sessionStorage.accessToken
      const refreshToken = sessionStorage.refreshToken
      if (!accessToken || !refreshToken) return undefined

      const usuario = await this.verificarToken(accessToken)
      if (!usuario) return undefined

      const nuevoAccessToken = await this.generarToken({
         id: usuario.id || 0,
         tipo: usuario.tipo,
         nombre: usuario.nombre,
         email: usuario.email,
         rol: usuario.rol,
         expTime: usuario.expTime,
         exp: usuario.exp
      })

      return nuevoAccessToken
   }

   async renovarToken(): Promise<void> {
      const accessToken = sessionStorage.accessToken
      const refreshToken = sessionStorage.refreshToken
      if (!accessToken || !refreshToken) return

      const usuario = await this.verificarToken(accessToken)
      if (!usuario) return

      // calcular 2min antes del vencimiento
      const expTime = usuario.exp
      const now = Date.now() / 1000

      if (now > expTime - 120) {
         const nuevoAccessToken = await this.obtenerToken()
         if (!nuevoAccessToken) return
         sessionStorage.accessToken = nuevoAccessToken
      }
   }
}

export const authService = new AuthService()

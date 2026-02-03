import { SignJWT, jwtVerify } from "jose"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"
import { EXP_ACCESS_TOKEN, EXP_REFRESH_TOKEN } from "../appconfig/Constants"

/**
 * Simular autenticación JSON Web Tokens (JWT).
 */
class AuthService {
   private secret: Uint8Array

   constructor() {
      this.secret = new TextEncoder().encode(
         "esta-es-una-llave-secreta-para-simulacion-123456789")
   }

   async generarToken(usuario: InfoUsuaModel) {
      const expTime = usuario.tipo === "access" ?
         EXP_ACCESS_TOKEN : EXP_REFRESH_TOKEN

      const jwt = await new SignJWT({ ...usuario })
         .setProtectedHeader({ alg: "HS256" })
         .setIssuedAt()
         .setExpirationTime(expTime)
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
}

export const authService = new AuthService()

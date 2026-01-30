import { SignJWT, jwtVerify } from "jose"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"

class AuthService {
   private secret: Uint8Array

   constructor() {
      this.secret = new TextEncoder().encode(
         "esta-es-una-llave-secreta-para-simulacion-123456789")
   }

   async generarToken(usuario: InfoUsuaModel) {
      const jwt = await new SignJWT({ ...usuario })
         .setProtectedHeader({ alg: "HS256" })
         .setIssuedAt()
         .setExpirationTime("2min")
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

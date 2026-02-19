import { decodeJwt } from "jose"
import { API_URL } from "../appconfig/Constants"
import { FetchUtility } from "../appconfig/FetchUtility"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"
import type { TokenModel } from "../models/TokenModel"

export class AuthApiService {
   async generarToken(params: InfoUsuaModel) {
      const jwt = `no-aplica${params.id}`
      return jwt
   }

   async verificarToken(token: string) {
      try {
         if (!token) return null
         const payload = decodeJwt(token) as unknown as InfoUsuaModel
         const now = Date.now() / 1000
         if (payload.exp && now >= payload.exp) return null
         return payload
      } catch {
         return null
      }
   }

   private async obtenerToken(): Promise<string | undefined> {
      const url = `${API_URL}/refrescar-token`
      const params = FetchUtility.setParams({})
      const response = await fetch(url, params)
      const data = await FetchUtility.getData<TokenModel>(response)
      return data?.accessToken
   }

   async renovarToken(): Promise<void> {
      const accessToken = sessionStorage.accessToken
      const refreshToken = sessionStorage.refreshToken
      if (!accessToken || !refreshToken) return

      const usuario = await this.verificarToken(accessToken)
      if (!usuario) return

      // calcular 1min antes del vencimiento
      const expTime = usuario.exp
      const now = Date.now() / 1000

      if (now > expTime - 60) {
         const nuevoAccessToken = await this.obtenerToken()
         if (!nuevoAccessToken) return
         sessionStorage.accessToken = nuevoAccessToken
      }
   }
}

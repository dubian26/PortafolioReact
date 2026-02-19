import { API_URL } from "../appconfig/Constants"
import { FetchUtility } from "../appconfig/FetchUtility"
import { type ConfigModel } from "../models/ConfigModel"
import { type IdResult } from "../models/IdResult"
import { type TokenModel } from "../models/TokenModel"
import { type UsuarioModel } from "../models/UsuarioModel"
import { authService } from "../services/AuthService"

export class UsuarioApiRepository {

   asignarConfig(config: ConfigModel) {
      console.log("solo modo local", config)
   }

   async autenticar(email: string, password: string): Promise<TokenModel | undefined> {
      const url = `${API_URL}/login`
      const params = FetchUtility.setParams({ email, password })
      const response = await fetch(url, params)
      const data = await FetchUtility.getData<TokenModel>(response)
      return data
   }

   async buscarPorEmail(email: string): Promise<UsuarioModel | undefined> {
      await authService.renovarToken()
      const url = `${API_URL}/buscar-usuario-por-email`
      const params = FetchUtility.setParams({ email })
      const response = await fetch(url, params)
      const data = await FetchUtility.getData<UsuarioModel>(response)
      return data
   }

   async buscarPorId(id: string): Promise<UsuarioModel | undefined> {
      await authService.renovarToken()
      const url = `${API_URL}/buscar-usuario-por-id`
      const params = FetchUtility.setParams({ id })
      const response = await fetch(url, params)
      const data = await FetchUtility.getData<UsuarioModel>(response)
      return data
   }

   async listarTodos(): Promise<UsuarioModel[]> {
      await authService.renovarToken()
      const url = `${API_URL}/listar-usuarios`
      const params = FetchUtility.setParams({})
      const response = await fetch(url, params)
      const data = await FetchUtility.getData<UsuarioModel[]>(response)
      return data as UsuarioModel[]
   }

   async crearCuenta(item: UsuarioModel): Promise<string> {
      await authService.renovarToken()
      const url = `${API_URL}/crear-cuenta-usuario`
      const params = FetchUtility.setParams(item)
      const response = await fetch(url, params)
      const data = await FetchUtility.getData<IdResult>(response)
      return data?.id ?? "0"
   }

   async actualizar(item: UsuarioModel): Promise<void> {
      await authService.renovarToken()
      const url = `${API_URL}/actualizar-usuario`
      const params = FetchUtility.setParams(item)
      const response = await fetch(url, params)
      await FetchUtility.getData<UsuarioModel>(response)
   }
}
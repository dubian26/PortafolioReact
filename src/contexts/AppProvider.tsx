
import { Toast } from "primereact/toast"
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { CustomError } from "../appconfig/CustomError"
import { SessionTimeout } from "../components/common/SessionTimeout"
import { type ConfigModel } from "../models/ConfigModel"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"
import { configRepository } from "../repositories/ConfigRepository"
import { authService } from "../services/AuthService"
import { AppContext, defaultConfig } from "./AppContext"

type Props = {
   children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
   // estados
   const [usuarioSesion, setUsuarioSesion] = useState<InfoUsuaModel | null>(null)
   const [config, setConfig] = useState<ConfigModel>(defaultConfig)
   const [loading, setLoading] = useState(true)
   const estaAutenti = usuarioSesion !== null
   const toast = useRef<Toast | null>(null)

   const cargarConfig = useCallback(async () => {
      try {
         setLoading(true)
         const storedConfig = await configRepository.obtener()
         if (storedConfig) setConfig(storedConfig)
      } catch (error) {
         console.error("Error loading configuration:", error)
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => { configRepository.asignarConfig(config) }, [config])
   useEffect(() => { cargarConfig() }, [cargarConfig])

   const logout = useCallback(() => {
      setUsuarioSesion(null)
      sessionStorage.accessToken = ""
      sessionStorage.refreshToken = ""
   }, [])

   const validarUsuarioSes = useCallback(async () => {
      const token = sessionStorage.accessToken
      const usuario = await authService.verificarToken(token)
      if (usuario === null) logout()
      setUsuarioSesion(usuario)
   }, [logout])

   const updateConfig = useCallback(async (newConfig: ConfigModel) => {
      try {
         await configRepository.guardar(newConfig)
         setConfig(newConfig)
      } catch (error) {
         console.error("Error saving configuration:", error)
         throw error
      }
   }, [])

   const resetConfig = useCallback(async () => {
      await updateConfig(defaultConfig)
   }, [updateConfig])

   const handleTimeout = useCallback(() => {
      logout()
      toast?.current?.show({
         sticky: true,
         severity: "warn",
         summary: "Atención!",
         detail: "Su sesión ha expirado por inactividad"
      })
   }, [logout])

   const mostrarError = useCallback((error: CustomError | string) => {
      let message = ""
      if (typeof error === "string") message = error
      else message = error.errorModel?.message || error.message || "Error desconocido"

      toast?.current?.show({
         severity: "error",
         summary: "Atención!",
         detail: message
      })
   }, [toast])

   const mostrarMensaje = useCallback((mensaje: string) => {
      toast?.current?.show({
         severity: "success",
         summary: "Éxito!",
         detail: mensaje
      })
   }, [toast])

   const context = useMemo(() => ({
      usuarioSesion,
      config,
      loading,
      validarUsuarioSes,
      logout,
      mostrarError,
      mostrarMensaje,
      updateConfig,
      resetConfig
   }), [
      usuarioSesion, config, loading,
      validarUsuarioSes, logout, mostrarError,
      mostrarMensaje, updateConfig, resetConfig])

   return (
      <AppContext.Provider value={context}>
         <Toast ref={toast} />
         {
            estaAutenti && (
               <SessionTimeout
                  onTimeout={handleTimeout}
                  timeout={config.sessionTimeout}
                  avisarCuandoQuede={config.sessionWarning}
               />
            )
         }
         {loading ? <div>Cargando...</div> : children}
      </AppContext.Provider>
   )
}

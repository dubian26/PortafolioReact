
import { Toast } from "primereact/toast"
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import { CustomError } from "../appconfig/CustomError"
import { SessionTimeout } from "../components/common/SessionTimeout"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"
import { authService } from "../services/AuthService"
import { AppContext } from "./AppContext"

type Props = {
   children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
   // estados
   const [usuarioSes, setUsuarioSes] = useState<InfoUsuaModel | null>(null)
   const estaAutenti = usuarioSes !== null
   const toast = useRef<Toast | null>(null)

   const handleLogout = useCallback(() => {
      setUsuarioSes(null)
      sessionStorage.tokenApi = ""
   }, [])

   const handleTimeout = useCallback(() => {
      handleLogout()
      toast?.current?.show({
         sticky: true,
         severity: "warn",
         summary: "Atención!",
         detail: "Su sesión ha expirado por inactividad"
      })
   }, [handleLogout])

   const context = useMemo(() => ({
      usuarioSesion: usuarioSes,
      validarUsuarioSes: async () => {
         const token = sessionStorage.tokenApi
         const usuario = await authService.verificarToken(token)
         if (usuario === null) sessionStorage.tokenApi = ""
         setUsuarioSes(usuario)
      },
      logout: () => handleLogout(),
      mostrarError: (error: CustomError | string) => {
         let message = ""
         if (typeof error === "string") message = error
         else message = error.errorModel?.message || error.message || "Error desconocido"

         toast?.current?.show({
            severity: "error",
            summary: "Atención!",
            detail: message
         })
      },
      mostrarExito: (mensaje: string) => {
         toast?.current?.show({
            severity: "success",
            summary: "Éxito!",
            detail: mensaje
         })
      }
   }), [usuarioSes, toast, handleLogout])

   return (
      <AppContext.Provider value={context}>
         <Toast ref={toast} />
         {
            estaAutenti && (
               <SessionTimeout
                  onTimeout={handleTimeout}
                  timeoutSeconds={30}
                  warningSeconds={20}
               />
            )
         }
         {children}
      </AppContext.Provider>
   )
}

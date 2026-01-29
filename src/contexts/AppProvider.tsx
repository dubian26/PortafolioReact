
import { Toast } from "primereact/toast"
import { useMemo, useRef, useState, type ReactNode } from "react"
import { CustomError } from "../appconfig/CustomError"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"
import { authService } from "../services/AuthService"
import { AppContext } from "./AppContext"

type Props = {
   children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
   // estados
   const [usuarioSes, setUsuarioSes] = useState<InfoUsuaModel | null>(null)
   const toast = useRef<Toast | null>(null)

   const context = useMemo(() => ({
      usuarioSesion: usuarioSes,
      validarUsuarioSes: async () => {
         const token = sessionStorage.tokenApi
         const usuario = await authService.verificarToken(token)
         if (usuario === null) sessionStorage.tokenApi = ""
         setUsuarioSes(usuario)
      },
      logout: () => {
         setUsuarioSes(null)
         sessionStorage.tokenApi = ""
      },
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
   }), [usuarioSes, toast])

   return (
      <AppContext.Provider value={context}>
         <Toast ref={toast} />
         {children}
      </AppContext.Provider>
   )
}

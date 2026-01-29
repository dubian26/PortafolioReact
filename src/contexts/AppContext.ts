import { createContext } from "react"
import { CustomError } from "../appconfig/CustomError"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"

type Props = {
   usuarioSesion: InfoUsuaModel | null
   validarUsuarioSes: () => Promise<void>
   logout: () => void
   mostrarError: (error: CustomError | string) => void
   mostrarExito: (mensaje: string) => void
}

export const AppContext = createContext<Props>({
   usuarioSesion: null,
   validarUsuarioSes: () => Promise.resolve(),
   logout: () => { },
   mostrarError: () => { },
   mostrarExito: () => { }
})

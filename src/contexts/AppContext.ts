import { createContext } from "react"
import { CustomError } from "../appconfig/CustomError"
import { type InfoUsuaModel } from "../models/InfoUsuaModel"
import { type ConfigModel } from "../models/ConfigModel"

export const defaultConfig: ConfigModel = {
   id: 1,
   mockRequestDelay: "2s",
   expRefreshToken: "1d",
   expAccessToken: "15m",
   sessionTimeout: "30m",
   sessionWarning: "2m"
}

type Props = {
   usuarioSesion: InfoUsuaModel | null
   config: ConfigModel
   validarUsuarioSes: () => Promise<void>
   logout: () => void
   mostrarError: (error: CustomError | string) => void
   mostrarMensaje: (mensaje: string) => void
   updateConfig: (config: ConfigModel) => Promise<void>
   resetConfig: () => Promise<void>
}

export const AppContext = createContext<Props>({
   usuarioSesion: null,
   config: defaultConfig,
   validarUsuarioSes: () => Promise.resolve(),
   logout: () => { },
   mostrarError: () => { },
   mostrarMensaje: () => { },
   updateConfig: async () => { },
   resetConfig: async () => { }
})

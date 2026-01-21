import { createContext } from "react"
import { CustomError } from "../appconfig/CustomError"

type Props = {
   token: string
   login: (token: string) => void
   logout: () => void
   mostrarError: (error: CustomError | string) => void
}

export const AppContext = createContext<Props>({
   token: "",
   login: () => { },
   logout: () => { },
   mostrarError: () => { }
})

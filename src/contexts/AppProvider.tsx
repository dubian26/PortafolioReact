
import { Toast } from "primereact/toast"
import { useMemo, useRef, useState, type ReactNode } from "react"
import { CustomError } from "../appconfig/CustomError"
import { AppContext } from "./AppContext"

type Props = {
    children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
    // estados
    const [token, setToken] = useState(sessionStorage.tokenApi)
    const toast = useRef<Toast | null>(null)

    const context = useMemo(() => ({
        token: token,
        login: (token: string) => {
            setToken(token)
            sessionStorage.tokenApi = token
        },
        logout: () => {
            setToken("")
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
    }), [token, toast])

    return (
        <AppContext.Provider value={context}>
            <Toast ref={toast} />
            {children}
        </AppContext.Provider>
    )
}

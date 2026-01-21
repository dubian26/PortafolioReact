
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
        mostrarError: (error: Error | string) => {
            let message = ""
            if (error instanceof CustomError) message = error.errorModel.message
            else if (error instanceof Error) message = error.message
            else message = error

            toast?.current?.show({
                severity: "error",
                summary: "Atentión!",
                detail: message
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

import { Menu } from "primereact/menu"
import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, type RefObject } from "react"
import { AppContext } from "../../contexts/AppContext"

type Props = {
    ref: RefObject<OverlayPanel | null>
}

export const OpcionesPanel = ({ ref }: Props) => {
    const appCtx = useContext(AppContext)

    return (
        <OverlayPanel ref={ref}>
            <Menu
                pt={{ root: { className: "border-0 bg-transparent" } }}
                model={[
                    {
                        label: "Perfil", icon: "fa-solid fa-user",
                        command: () => appCtx.mostrarError("Opción no implementada")
                    },
                    {
                        label: "Configuración", icon: "fa-solid fa-gear",
                        command: () => appCtx.mostrarError("Opción no implementada")
                    },
                    {
                        label: "Cerrar Sesión", icon: "fa-solid fa-sign-out",
                        command: () => appCtx.logout()
                    }
                ]}
            />
        </OverlayPanel>
    )
}

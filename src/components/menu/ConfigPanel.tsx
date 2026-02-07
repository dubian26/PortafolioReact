import { Dialog } from "primereact/dialog"
import { Menu } from "primereact/menu"
import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, useState, type RefObject } from "react"
import { AppContext } from "../../contexts/AppContext"
import { HeaderText } from "../common/HeaderText"
import { EditarUsuario } from "../usuario/EditarUsuario"

type Props = {
    ref: RefObject<OverlayPanel | null>
}

export const ConfigPanel = ({ ref }: Props) => {
    const appCtx = useContext(AppContext)
    const usuarioSesion = appCtx.usuarioSesion
    const [editDialogVisible, setEditDialogVisible] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)

    const handleAbrirEditarUsu = (id: number | undefined) => {
        setSelectedUserId(id)
        setEditDialogVisible(true)
    }

    const handleCerrarEditarUsu = () => {
        setEditDialogVisible(false)
        setSelectedUserId(undefined)
    }

    const handleUsuActualizado = () => {
        handleCerrarEditarUsu()
        appCtx.logout()
    }

    return (
        <OverlayPanel ref={ref}>
            <div className="p-2">
                <div className="font-bold">{usuarioSesion?.nombre}</div>
                <div>{usuarioSesion?.email}</div>
            </div>
            <Menu
                pt={{ root: { className: "border-0 bg-transparent" } }}
                model={[
                    {
                        label: "Perfil", icon: "fa-solid fa-user",
                        command: () => handleAbrirEditarUsu(usuarioSesion?.id)
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
            <Dialog
                header={<HeaderText>Editar Usuario</HeaderText>}
                visible={editDialogVisible}
                style={{ width: "50vw" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                onHide={handleCerrarEditarUsu}
            >
                {
                    selectedUserId && (
                        <EditarUsuario
                            id={selectedUserId}
                            onUpdate={handleUsuActualizado}
                        />
                    )
                }
            </Dialog>
        </OverlayPanel>
    )
}

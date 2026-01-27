import { Avatar } from "primereact/avatar"
import { BreadCrumb } from "primereact/breadcrumb"
import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, useRef } from "react"
import perfilDubian from "../../assets/avatars/perfil-dubian26.png"
import { AppContext } from "../../contexts/AppContext"
import { OpcionesPanel } from "./OpcionesPanel"

export const Topbar = () => {
    const appCtx = useContext(AppContext)
    const overlayUsua = useRef<OverlayPanel | null>(null)

    return (
        <div className="p-2 flex justify-between items-center">
            <BreadCrumb
                home={{ icon: "fa-solid fa-house", url: "/" }}
                model={[{ label: "Usuarios" }]}
                pt={{ root: { className: "border-0 bg-transparent" } }}
            />
            <nav className="w-52 shrink-0 flex justify-end gap-1">
                <button
                    onClick={() => appCtx.mostrarError("Opción no implementada")}
                    className={`
                        size-10 min-w-10 rounded-full cursor-pointer
                        text-primary hover:bg-primary/10 fa-solid fa-bell
                    `}
                />
                <Avatar
                    onClick={ev => overlayUsua.current?.toggle(ev)}
                    image={perfilDubian} size="xlarge" shape="circle"
                />
                <OpcionesPanel ref={overlayUsua} />
            </nav>
        </div>
    )
}

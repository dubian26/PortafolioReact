import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, useRef } from "react"
import { AppContext } from "../../contexts/AppContext"
import { PerfilDialog } from "./PerfilDialog"

export const Topbar = () => {
    const appCtx = useContext(AppContext)
    const overlayUsua = useRef<OverlayPanel | null>(null)

    return (
        <div className="p-2 flex justify-between items-center">
            <nav className="grow"></nav>
            <nav className="w-52 shrink-0 flex justify-end gap-1">
                <button
                    onClick={() => appCtx.mostrarError("Opción no implementada")}
                    className="
                        size-10 min-w-10 rounded-full cursor-pointer 
                        text-primary hover:bg-primary/10 fa-solid fa-bell"
                />
                <button
                    onClick={ev => overlayUsua.current?.toggle(ev)}
                    className="
                        size-10 min-w-10 rounded-full cursor-pointer 
                        text-primary hover:bg-primary/10 fa-regular fa-user"
                />
                <PerfilDialog ref={overlayUsua} />
            </nav>
        </div>
    )
}

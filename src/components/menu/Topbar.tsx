import { BreadCrumb } from "primereact/breadcrumb"
import { type MenuItem } from "primereact/menuitem"
import { useContext } from "react"
import { AppContext } from "../../contexts/AppContext"

export const Topbar = () => {
    const appCtx = useContext(AppContext)
    const items: MenuItem[] = [{ label: "Usuarios" }]
    const home: MenuItem = { icon: "fa-solid fa-house", url: "http://localhost:5173/" }

    return (
        <div className="flex justify-between items-center">
            <BreadCrumb
                model={items} home={home}
                pt={{ root: { className: "border-0 bg-transparent" } }}
            />
            <nav className="w-52 shrink-0 flex justify-end gap-1">
                <button
                    onClick={() => appCtx.logout()}
                    className={`
                        size-10 min-w-10 rounded-full cursor-pointer
                        text-primary hover:bg-primary/10 fa-solid fa-bell
                    `}
                />
                <button
                    onClick={() => appCtx.logout()}
                    className={`
                        size-10 min-w-10 rounded-full cursor-pointer
                        text-primary hover:bg-primary/10 fa-solid fa-sign-out
                    `}
                />
            </nav>
        </div>
    )
}

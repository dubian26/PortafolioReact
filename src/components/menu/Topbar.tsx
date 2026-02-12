import { OverlayPanel } from "primereact/overlaypanel"
import { useRef } from "react"
import { useCart } from "../../contexts/CartContext"
import { PerfilDialog } from "./PerfilDialog"

export const Topbar = () => {
    const overlayUsua = useRef<OverlayPanel | null>(null)
    const { cart, toggleCart } = useCart()

    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0)

    return (
        <div className="p-2 flex justify-between items-center">
            <nav className="grow"></nav>
            <nav className="w-52 shrink-0 flex justify-end gap-1">
                <button
                    onClick={toggleCart}
                    className="
                        size-10 min-w-10 rounded-full cursor-pointer relative
                        text-primary hover:bg-primary/10 fa-solid fa-cart-shopping"
                >
                    {totalItems > 0 && (
                        <span
                            className="topbar-cart-badge"
                        >
                            {totalItems > 99 ? "99+" : totalItems}
                        </span>
                    )}
                </button>
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


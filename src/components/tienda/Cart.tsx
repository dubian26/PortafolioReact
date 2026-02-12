import { Button } from "primereact/button"
import { Sidebar } from "primereact/sidebar"
import { useNavigate } from "react-router-dom"
import { type CartItem, useCart } from "../../contexts/CartContext"

export const Cart = () => {
   const { cart, removeFromCart, total, cartVisible, setCartVisible, executeCheckout, hasCheckoutHandler } = useCart()
   const navigate = useNavigate()

   const formatCurrency = (value: number) =>
      value.toLocaleString("en-US", { style: "currency", currency: "USD" })

   const handleCheckoutClick = () => {
      if (hasCheckoutHandler) {
         executeCheckout()
      } else {
         setCartVisible(false)
         navigate("/tienda")
      }
   }

   const headerContent = (
      <div className="cart-drawer__header-content">
         <i className="fa-solid fa-cart-shopping cart-drawer__header-icon"></i>
         <div>
            <h2 className="cart-drawer__title">Carrito de Compras</h2>
            <span className="cart-drawer__subtitle">
               {cart.length === 0
                  ? "Tu carrito está vacío"
                  : `${cart.reduce((acc, i) => acc + i.cantidad, 0)} artículo(s)`}
            </span>
         </div>
      </div>
   )

   const renderItem = (item: CartItem) => (
      <div key={item.id} className="cart-item">
         <div className="cart-item__icon-wrap">
            <i className="fa-solid fa-box-open cart-item__icon"></i>
         </div>

         <div className="cart-item__info">
            <span className="cart-item__name">{item.nombre}</span>
            <span className="cart-item__price">{formatCurrency(item.precio)} c/u</span>
         </div>

         <div className="cart-item__qty-wrap">
            <span className="cart-item__qty-label">Cant.</span>
            <span className="cart-item__qty-value">{item.cantidad}</span>
         </div>

         <div className="cart-item__subtotal-wrap">
            <span className="cart-item__subtotal-label">Subtotal</span>
            <span className="cart-item__subtotal-value">{formatCurrency(item.subtotal)}</span>
         </div>

         <button
            className="cart-item__remove-btn"
            onClick={() => removeFromCart(item.id!)}
            title="Quitar del carrito"
         >
            <i className="fa-solid fa-trash-can"></i>
         </button>
      </div>
   )

   return (
      <>
         <Sidebar
            visible={cartVisible}
            position="right"
            onHide={() => setCartVisible(false)}
            header={headerContent}
            className="cart-drawer"
         >
            <div className="cart-drawer__body">
               {cart.length === 0 ? (
                  <div className="cart-drawer__empty">
                     <i className="fa-solid fa-cart-shopping cart-drawer__empty-icon"></i>
                     <p className="cart-drawer__empty-text">No hay productos en el carrito</p>
                     <p className="cart-drawer__empty-hint">Agrega productos desde la tienda</p>
                  </div>
               ) : (
                  <div className="cart-drawer__items">
                     {cart.map(renderItem)}
                  </div>
               )}
            </div>

            {cart.length > 0 && (
               <div className="cart-drawer__footer">
                  <div className="cart-drawer__total-row">
                     <span className="cart-drawer__total-label">Total</span>
                     <span className="cart-drawer__total-value">{formatCurrency(total)}</span>
                  </div>
                  <Button
                     label={hasCheckoutHandler ? "Checkout / Crear Orden" : "Ir a la Tienda"}
                     icon={hasCheckoutHandler ? "fa-solid fa-check" : "fa-solid fa-store"}
                     className="cart-drawer__checkout-btn w-full"
                     onClick={handleCheckoutClick}
                     disabled={cart.length === 0}
                  />
               </div>
            )}
         </Sidebar>

         <style>{`
            /* ========= Drawer sizing ========= */
            .cart-drawer {
               width: 100% !important;
            }
            @media (min-width: 576px) {
               .cart-drawer { width: 26rem !important; }
            }
            @media (min-width: 992px) {
               .cart-drawer { width: 30rem !important; }
            }

            /* ========= Header ========= */
            .cart-drawer__header-content {
               display: flex;
               align-items: center;
               gap: 0.75rem;
            }
            .cart-drawer__header-icon {
               font-size: 1.35rem;
               background: linear-gradient(135deg, var(--cyan-400), var(--blue-500));
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
            }
            .cart-drawer__title {
               margin: 0;
               font-size: 1.1rem;
               font-weight: 700;
               color: var(--text-color);
            }
            .cart-drawer__subtitle {
               font-size: 0.78rem;
               color: var(--text-color-secondary);
            }

            /* ========= Body ========= */
            .cart-drawer__body {
               display: flex;
               flex-direction: column;
               flex: 1;
               overflow-y: auto;
               padding-bottom: 1rem;
            }
            .cart-drawer__items {
               display: flex;
               flex-direction: column;
               gap: 0.625rem;
            }

            /* ========= Empty state ========= */
            .cart-drawer__empty {
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               padding: 3rem 1rem;
               text-align: center;
            }
            .cart-drawer__empty-icon {
               font-size: 3.5rem;
               opacity: 0.12;
               color: var(--text-color-secondary);
               margin-bottom: 1rem;
            }
            .cart-drawer__empty-text {
               font-size: 1rem;
               font-weight: 600;
               color: var(--text-color);
               margin: 0 0 0.25rem;
            }
            .cart-drawer__empty-hint {
               font-size: 0.8rem;
               color: var(--text-color-secondary);
               margin: 0;
            }

            /* ========= Cart item card ========= */
            .cart-item {
               display: grid;
               grid-template-columns: 2.75rem 1fr auto auto 2.25rem;
               grid-template-rows: auto;
               align-items: center;
               gap: 0.625rem;
               padding: 0.75rem;
               border-radius: 0.75rem;
               background: rgba(255,255,255,0.03);
               border: 1px solid rgba(255,255,255,0.06);
               transition: background 0.2s ease, border-color 0.2s ease;
            }
            .cart-item:hover {
               background: rgba(255,255,255,0.06);
               border-color: rgba(6,182,212,0.2);
            }

            /* Icon */
            .cart-item__icon-wrap {
               width: 2.75rem;
               height: 2.75rem;
               border-radius: 0.625rem;
               background: linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.12));
               display: flex;
               align-items: center;
               justify-content: center;
            }
            .cart-item__icon {
               font-size: 1rem;
               color: var(--cyan-400);
            }

            /* Name & unit price */
            .cart-item__info {
               display: flex;
               flex-direction: column;
               min-width: 0;
            }
            .cart-item__name {
               font-size: 0.875rem;
               font-weight: 600;
               color: var(--text-color);
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
            }
            .cart-item__price {
               font-size: 0.72rem;
               color: var(--text-color-secondary);
            }

            /* Quantity */
            .cart-item__qty-wrap {
               display: flex;
               flex-direction: column;
               align-items: center;
               min-width: 2.5rem;
            }
            .cart-item__qty-label {
               font-size: 0.6rem;
               text-transform: uppercase;
               letter-spacing: 0.04em;
               color: var(--text-color-secondary);
               font-weight: 600;
            }
            .cart-item__qty-value {
               font-size: 1rem;
               font-weight: 700;
               background: linear-gradient(135deg, var(--cyan-400), var(--blue-500));
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
            }

            /* Subtotal */
            .cart-item__subtotal-wrap {
               display: flex;
               flex-direction: column;
               align-items: flex-end;
               min-width: 4rem;
            }
            .cart-item__subtotal-label {
               font-size: 0.6rem;
               text-transform: uppercase;
               letter-spacing: 0.04em;
               color: var(--text-color-secondary);
               font-weight: 600;
            }
            .cart-item__subtotal-value {
               font-size: 0.875rem;
               font-weight: 700;
               color: var(--text-color);
            }

            /* Remove button */
            .cart-item__remove-btn {
               width: 2.25rem;
               height: 2.25rem;
               border-radius: 0.5rem;
               border: 1px solid rgba(239,68,68,0.15);
               background: rgba(239,68,68,0.06);
               color: var(--red-400);
               cursor: pointer;
               display: flex;
               align-items: center;
               justify-content: center;
               font-size: 0.8rem;
               transition: all 0.2s ease;
            }
            .cart-item__remove-btn:hover {
               background: rgba(239,68,68,0.18);
               border-color: rgba(239,68,68,0.35);
               transform: scale(1.08);
            }
            .cart-item__remove-btn:active {
               transform: scale(0.95);
            }

            /* Responsive: stack on very small screens */
            @media (max-width: 420px) {
               .cart-item {
                  grid-template-columns: 2.5rem 1fr 2.25rem;
                  grid-template-rows: auto auto;
               }
               .cart-item__qty-wrap,
               .cart-item__subtotal-wrap {
                  grid-column: 2 / 3;
                  flex-direction: row;
                  gap: 0.375rem;
                  align-items: center;
                  justify-content: flex-start;
               }
               .cart-item__qty-wrap { grid-row: 2; }
               .cart-item__subtotal-wrap { grid-row: 2; grid-column: 2 / 4; justify-content: flex-end; }
               .cart-item__remove-btn {
                  grid-row: 1;
                  grid-column: 3;
               }
            }

            /* ========= Footer ========= */
            .cart-drawer__footer {
               border-top: 1px solid rgba(255,255,255,0.08);
               padding-top: 1rem;
               margin-top: auto;
            }
            .cart-drawer__total-row {
               display: flex;
               justify-content: space-between;
               align-items: center;
               margin-bottom: 0.875rem;
            }
            .cart-drawer__total-label {
               font-size: 0.9rem;
               font-weight: 600;
               color: var(--text-color-secondary);
               text-transform: uppercase;
               letter-spacing: 0.05em;
            }
            .cart-drawer__total-value {
               font-size: 1.35rem;
               font-weight: 800;
               background: linear-gradient(135deg, var(--cyan-400), var(--blue-500));
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
            }
            .cart-drawer__checkout-btn {
               background: linear-gradient(135deg, var(--blue-500), var(--cyan-400)) !important;
               border: none !important;
               font-weight: 600 !important;
               border-radius: 0.625rem !important;
               padding: 0.75rem 1.25rem !important;
               transition: box-shadow 0.3s ease, transform 0.2s ease !important;
            }
            .cart-drawer__checkout-btn:hover:not(:disabled) {
               box-shadow: 0 6px 25px rgba(6, 182, 212, 0.35) !important;
               transform: translateY(-1px) !important;
            }
            .cart-drawer__checkout-btn:disabled {
               opacity: 0.5 !important;
            }

            /* ========= Topbar badge ========= */
            .topbar-cart-badge {
               position: absolute;
               top: -2px;
               right: -2px;
               min-width: 1.2rem;
               height: 1.2rem;
               padding: 0 0.3rem;
               border-radius: 9999px;
               background: linear-gradient(135deg, var(--red-400), var(--red-500));
               color: #fff;
               font-size: 0.65rem;
               font-weight: 700;
               display: flex;
               align-items: center;
               justify-content: center;
               line-height: 1;
               box-shadow: 0 2px 8px rgba(239,68,68,0.4);
               animation: cartBadgePop 0.3s ease;
               font-family: inherit;
               -webkit-text-fill-color: #fff;
           }
            @keyframes cartBadgePop {
               0% { transform: scale(0); }
               50% { transform: scale(1.3); }
               100% { transform: scale(1); }
            }
         `}</style>
      </>
   )
}

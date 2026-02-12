import { Button } from "primereact/button"
import { Tag } from "primereact/tag"
import { Toast } from "primereact/toast"
import { useContext, useEffect, useRef, useState } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { AppContext } from "../contexts/AppContext"
import { useCart } from "../contexts/CartContext"
import { type Factura } from "../models/FacturaModel"
import { type Orden } from "../models/OrdenModel"
import { type Producto } from "../models/ProductoModel"
import { facturaRepository } from "../repositories/FacturaRepository"
import { ordenRepository } from "../repositories/OrdenRepository"
import { productoRepository } from "../repositories/ProductoRepository"

export const TiendaPage = () => {
   const [productos, setProductos] = useState<Producto[]>([])
   const { addToCart, cart, clearCart, total, setCartVisible, registerCheckoutHandler } = useCart()
   const { usuarioSesion } = useContext(AppContext)
   const toast = useRef<Toast>(null)

   const cargarProductos = async () => {
      try {
         const data = await productoRepository.listarTodos()
         setProductos(data)
      } catch {
         // ignore
      }
   }

   useEffect(() => {
      cargarProductos()
   }, [])


   const handleAddToCart = (product: Producto) => {
      if (product.stock > 0) {
         addToCart(product, 1)
         toast.current?.show({ severity: "success", summary: "Agregado", detail: `${product.nombre} agregado al carrito`, life: 3000 })
      } else {
         toast.current?.show({ severity: "error", summary: "Sin Stock", detail: "Producto agotado", life: 3000 })
      }
   }

   const handleCheckout = async () => {
      if (!usuarioSesion) {
         toast.current?.show({ severity: "error", summary: "Error", detail: "Debes iniciar sesión", life: 3000 })
         return
      }

      if (cart.length === 0) return

      try {
         const nuevaOrden: Orden = {
            usuarioId: usuarioSesion.id,
            fecha: new Date(),
            total: total,
            estado: "Confirmada",
            items: cart.map(item => ({
               productoId: item.id!,
               productoNombre: item.nombre,
               cantidad: item.cantidad,
               precioUnitario: item.precio,
               subtotal: item.subtotal
            }))
         }

         const ordenId = await ordenRepository.agregar(nuevaOrden)

         const nuevaFactura: Factura = {
            ordenId: Number(ordenId),
            fecha: new Date(),
            numeroFactura: `FAC-${Date.now()}`,
            clienteNombre: usuarioSesion.nombre,
            clienteNit: "CF",
            total: total,
            items: nuevaOrden.items
         }

         await facturaRepository.agregar(nuevaFactura)

         for (const item of cart) {
            const producto = productos.find(p => p.id === item.id)
            if (producto) {
               const nuevoStock = producto.stock - item.cantidad
               await productoRepository.actualizar({ ...producto, stock: nuevoStock })
            }
         }

         clearCart()
         setCartVisible(false)

         cargarProductos()
         toast.current?.show({ severity: "success", summary: "Compra Exitosa", detail: `Orden #${ordenId} creada`, life: 3000 })

      } catch {
         toast.current?.show({ severity: "error", summary: "Error", detail: "Ocurrió un error al procesar la orden", life: 3000 })
      }
   }

   useEffect(() => {
      registerCheckoutHandler(handleCheckout)
      return () => registerCheckoutHandler(null)
   })

   const getStockColor = (stock: number) => {
      if (stock === 0) return "var(--red-500)"
      if (stock <= 5) return "var(--orange-500)"
      return "var(--green-500)"
   }

   return (
      <div className="p-4">
         <Toast ref={toast} />
         <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
            <HeaderText>Tienda Virtual</HeaderText>
            <Button
               className="p-button-raised"
               onClick={() => setCartVisible(true)}
            >
               <i className="fa-solid fa-cart-shopping mr-2"></i>
               Carrito
               {cart.length > 0 && (
                  <span style={{
                     background: "linear-gradient(135deg, var(--cyan-400), var(--blue-500))",
                     borderRadius: "50%",
                     width: "1.5rem",
                     height: "1.5rem",
                     display: "inline-flex",
                     alignItems: "center",
                     justifyContent: "center",
                     fontSize: "0.75rem",
                     fontWeight: 700,
                     marginLeft: "0.5rem",
                     color: "#fff"
                  }}>
                     {cart.length}
                  </span>
               )}
            </Button>
         </div>

         <div className="tienda-grid">
            {productos.map(product => (
               <div key={product.id} className="tienda-card">
                  {/* Gradient accent top */}
                  <div className="tienda-card__accent"></div>

                  {/* Header: Category + Stock Tag */}
                  <div className="tienda-card__header">
                     <div className="tienda-card__category">
                        <i className="fa-solid fa-tag" style={{ color: "var(--cyan-400)", fontSize: "0.75rem" }}></i>
                        <span>{product.categoria}</span>
                     </div>
                     <Tag
                        value={product.stock > 0 ? `${product.stock} uds` : "AGOTADO"}
                        severity={product.stock > 0 ? "success" : "danger"}
                        style={{ fontSize: "0.7rem" }}
                     />
                  </div>

                  {/* Product Icon Placeholder */}
                  <div className="tienda-card__icon-area">
                     <div className="tienda-card__icon-circle">
                        <i className="fa-solid fa-box-open" style={{ fontSize: "2rem", color: "var(--cyan-400)" }}></i>
                     </div>
                  </div>

                  {/* Product Info */}
                  <div className="tienda-card__body">
                     <h3 className="tienda-card__name">{product.nombre}</h3>
                     {product.descripcion && (
                        <p className="tienda-card__desc">{product.descripcion}</p>
                     )}
                  </div>

                  {/* Stock Bar */}
                  <div className="tienda-card__stock-bar">
                     <div
                        className="tienda-card__stock-fill"
                        style={{
                           width: `${Math.min((product.stock / 50) * 100, 100)}%`,
                           background: getStockColor(product.stock)
                        }}
                     ></div>
                  </div>

                  {/* Footer: Price + Add to Cart */}
                  <div className="tienda-card__footer">
                     <div className="tienda-card__price">
                        <span className="tienda-card__price-symbol">$</span>
                        <span className="tienda-card__price-value">
                           {product.precio.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                     </div>
                     <button
                        className="tienda-card__add-btn"
                        disabled={product.stock === 0}
                        onClick={() => handleAddToCart(product)}
                        title="Agregar al carrito"
                     >
                        <i className="fa-solid fa-cart-plus"></i>
                     </button>
                  </div>
               </div>
            ))}

            {productos.length === 0 && (
               <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-color-secondary)" }}>
                  <i className="fa-solid fa-store" style={{ fontSize: "3rem", marginBottom: "1rem", display: "block", opacity: 0.3 }}></i>
                  <p>No hay productos disponibles</p>
               </div>
            )}
         </div>

         <style>{`
            .tienda-grid {
               display: grid;
               grid-template-columns: repeat(1, 1fr);
               gap: 1.25rem;
            }

            @media (min-width: 576px) {
               .tienda-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (min-width: 992px) {
               .tienda-grid { grid-template-columns: repeat(3, 1fr); }
            }
            @media (min-width: 1400px) {
               .tienda-grid { grid-template-columns: repeat(4, 1fr); }
            }

            .tienda-card {
               position: relative;
               overflow: hidden;
               border-radius: 1rem;
               background: rgba(255,255,255, 0.04);
               backdrop-filter: blur(12px);
               border: 1px solid rgba(255,255,255, 0.08);
               display: flex;
               flex-direction: column;
               transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            }

            .tienda-card:hover {
               transform: translateY(-6px);
               box-shadow: 0 12px 40px rgba(6, 182, 212, 0.15);
               border-color: rgba(6, 182, 212, 0.3);
            }

            .tienda-card__accent {
               height: 4px;
               background: linear-gradient(90deg, var(--blue-500), var(--cyan-400), var(--cyan-200));
            }

            .tienda-card__header {
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 0.875rem 1rem 0;
            }

            .tienda-card__category {
               display: flex;
               align-items: center;
               gap: 0.375rem;
               font-size: 0.75rem;
               color: var(--text-color-secondary);
               text-transform: uppercase;
               letter-spacing: 0.05em;
               font-weight: 600;
            }

            .tienda-card__icon-area {
               display: flex;
               justify-content: center;
               padding: 1.5rem 1rem 0.75rem;
            }

            .tienda-card__icon-circle {
               width: 5rem;
               height: 5rem;
               border-radius: 50%;
               background: rgba(6, 182, 212, 0.08);
               border: 2px solid rgba(6, 182, 212, 0.15);
               display: flex;
               align-items: center;
               justify-content: center;
               transition: transform 0.3s ease, background 0.3s ease;
            }

            .tienda-card:hover .tienda-card__icon-circle {
               transform: scale(1.1);
               background: rgba(6, 182, 212, 0.14);
            }

            .tienda-card__body {
               padding: 0 1rem;
               text-align: center;
               flex-grow: 1;
            }

            .tienda-card__name {
               font-size: 1.05rem;
               font-weight: 700;
               margin: 0 0 0.375rem;
               color: var(--text-color);
            }

            .tienda-card__desc {
               font-size: 0.8rem;
               color: var(--text-color-secondary);
               margin: 0;
               line-height: 1.4;
               display: -webkit-box;
               -webkit-line-clamp: 2;
               -webkit-box-orient: vertical;
               overflow: hidden;
            }

            .tienda-card__stock-bar {
               margin: 0.875rem 1rem 0;
               height: 3px;
               border-radius: 2px;
               background: rgba(255,255,255, 0.06);
               overflow: hidden;
            }

            .tienda-card__stock-fill {
               height: 100%;
               border-radius: 2px;
               transition: width 0.4s ease;
            }

            .tienda-card__footer {
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 0.875rem 1rem;
            }

            .tienda-card__price {
               display: flex;
               align-items: baseline;
               gap: 0.125rem;
            }

            .tienda-card__price-symbol {
               font-size: 0.9rem;
               font-weight: 600;
               background: linear-gradient(135deg, var(--cyan-400), var(--blue-400));
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
            }

            .tienda-card__price-value {
               font-size: 1.4rem;
               font-weight: 800;
               background: linear-gradient(135deg, var(--cyan-400), var(--blue-400));
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
            }

            .tienda-card__add-btn {
               width: 2.5rem;
               height: 2.5rem;
               border-radius: 50%;
               border: none;
               cursor: pointer;
               display: flex;
               align-items: center;
               justify-content: center;
               font-size: 1rem;
               color: #fff;
               background: linear-gradient(135deg, var(--blue-500), var(--cyan-400));
               box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
               transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .tienda-card__add-btn:hover:not(:disabled) {
               transform: scale(1.12);
               box-shadow: 0 6px 25px rgba(6, 182, 212, 0.45);
            }

            .tienda-card__add-btn:active:not(:disabled) {
               transform: scale(0.95);
            }

            .tienda-card__add-btn:disabled {
               opacity: 0.3;
               cursor: not-allowed;
               box-shadow: none;
            }
         `}</style>
      </div>
   )
}

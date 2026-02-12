import { useContext, useMemo } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppContext } from "./contexts/AppContext"
import { CartProvider } from "./contexts/CartContext"
import { ContenidoPage } from "./pages/ContenidoPage"
import { DashboardPage } from "./pages/DashboardPage"
import { InventarioPage } from "./pages/InventarioPage"
import { LoginPage } from "./pages/LoginPage"
import { OrdenesPage } from "./pages/OrdenesPage"
import { TiendaPage } from "./pages/TiendaPage"
import { MenuPage } from "./pages/MenuPage"
import { UsuarioPage } from "./pages/UsuarioPage"

export const App = () => {
   const { usuarioSesion } = useContext(AppContext)
   const estaAutenti = usuarioSesion !== null

   const router = useMemo(() => createBrowserRouter([
      {
         path: "/login",
         element: !estaAutenti ? <LoginPage /> : <Navigate to="/" replace />,
      },
      {
         path: "/",
         element: estaAutenti ? <MenuPage /> : <Navigate to="/login" replace />,
         children: [
            {
               index: true,
               element: <Navigate to="/contenido" replace />,
            },
            {
               path: "contenido",
               element: <ContenidoPage />,
            },
            {
               path: "dashboard",
               element: <DashboardPage />,
            },
            {
               path: "usuarios",
               element: <UsuarioPage />,
            },
            {
               path: "inventario",
               element: <InventarioPage />,
            },
            {
               path: "tienda",
               element: <TiendaPage />,
            },
            {
               path: "ordenes",
               element: <OrdenesPage />,
            },
            {
               path: "facturas",
               element: <Navigate to="/ordenes" replace />,
            },
            {
               path: "*",
               element: <div className="p-4">Página en construcción...</div>
            }
         ],
      },
      {
         path: "*",
         element: <Navigate to="/" replace />,
      },
   ]), [estaAutenti])

   return (
      <CartProvider>
         <RouterProvider router={router} />
      </CartProvider>
   )
}

import { useContext } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppContext } from "./contexts/AppContext"
import { DashboardHome } from "./pages/DashboardHome"
import { LoginPage } from "./pages/LoginPage"
import { MenuPage } from "./pages/MenuPage"
import { UsuarioPage } from "./pages/UsuarioPage"

export const App = () => {
   const appCtx = useContext(AppContext)
   const estaAutenti = appCtx.usuarioSesion !== null

   const router = createBrowserRouter([
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
               element: <Navigate to="/dashboard" replace />,
            },
            {
               path: "dashboard",
               element: <DashboardHome />,
            },
            {
               path: "usuarios",
               element: <UsuarioPage />,
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
   ])

   return <RouterProvider router={router} />
}

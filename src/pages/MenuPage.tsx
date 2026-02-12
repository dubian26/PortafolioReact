import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/menu/Sidebar"
import { SidebarItem } from "../components/menu/SidebarItem"
import { Topbar } from "../components/menu/Topbar"
import { Cart } from "../components/tienda/Cart"
import { type MenuModel } from "../models/MenuModel"

export const MenuPage = () => {
   const menuItems: MenuModel[] = [
      { id: 1, icono: "fa-solid fa-house", texto: "Contenido", alerta: true, ruta: "/contenido" },
      { id: 2, icono: "fa-solid fa-chart-bar", texto: "Dashboard", alerta: false, ruta: "/dashboard" },
      { id: 3, icono: "fa-solid fa-user", texto: "Usuarios", alerta: false, ruta: "/usuarios" },
      { id: 4, icono: "fa-solid fa-warehouse", texto: "Inventario", alerta: false, ruta: "/inventario" },
      { id: 5, icono: "fa-solid fa-box", texto: "Ordenes", alerta: false, ruta: "/ordenes" },
      { id: 6, icono: "fa-solid fa-receipt", texto: "Facturas", alerta: false, ruta: "/facturas" },
      { id: 7, icono: "fa-solid fa-store", texto: "Tienda", alerta: false, ruta: "/tienda" }
   ]

   return (
      <div className="flex h-screen">
         <Sidebar>
            {
               menuItems.map(item => (
                  <SidebarItem
                     key={item.id}
                     icon={<i className={item.icono} />}
                     text={item.texto}
                     alert={item.alerta}
                     to={item.ruta}
                  />
               ))
            }
         </Sidebar>
         <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-2">
               <Outlet />
            </main>
         </div>
         <Cart />
      </div>
   )
}



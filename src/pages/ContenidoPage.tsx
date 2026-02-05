import { Fragment } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { Card } from "primereact/card"

export const ContenidoPage = () => {
   const caracteristicas = [
      {
         descripcion: "Se usa la libreria primereact para el manejo de componentes de interfaz de usuario profesionales",
         fecha: "2026-01-27 00:10"
      },
      {
         descripcion: "Se usa IndexedDB para simular el backend, permitiendo que todas las transacciones se realicen de forma local",
         fecha: "2026-01-26 21:39"
      },
      {
         descripcion: "Se implemento una simulación de seguridad basada en accessToken y refreshToken (Silent Refresh)",
         fecha: "2026-02-01 03:20"
      },
      {
         descripcion: "Se agrego un componente de SessionTimeout para el control automático de la inactividad del usuario",
         fecha: "2026-01-31 21:14"
      },
      {
         descripcion: "Implementación de sistema de cambio de tema dinámico (Light/Dark Mode) con persistencia",
         fecha: "2026-01-26 05:18"
      },
      {
         descripcion: "Abstracción de la capa de datos utilizando el patrón Repository para mayor escalabilidad",
         fecha: "2026-01-26 21:39"
      },
      {
         descripcion: "Diseño responsivo y estética premium desarrollado íntegramente con Tailwind CSS v4",
         fecha: "2026-01-24 05:12"
      },
      {
         descripcion: "Gestión centralizada de autenticación y configuración global mediante Context API",
         fecha: "2026-01-25 16:49"
      }
   ]

   return (
      <Fragment>
         <HeaderText>Contenido</HeaderText>
         <p className="text-lg mb-4">
            Listado detallado de las funcionalidades y tecnologías desarrolladas en esta aplicación.
         </p>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {
               caracteristicas.map((item, index) => (
                  <Card key={index}>
                     <div className="flex items-start gap-3">
                        <div className="shrink-0">
                           <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="grow">
                           <div className="text-md leading-snug">
                              {item.descripcion}
                           </div>
                           <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-400 dark:text-gray-500">
                              <i className="fa-solid fa-calendar-plus"></i>
                              <span>Desarrollado: {item.fecha}</span>
                           </div>
                        </div>
                     </div>
                  </Card>
               ))
            }
         </div>
      </Fragment>
   )
}

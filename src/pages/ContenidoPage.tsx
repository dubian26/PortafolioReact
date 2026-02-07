import { Fragment } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { Card } from "primereact/card"

export const ContenidoPage = () => {
   const caracteristicas = [
      {
         descripcion: "Se usa la libreria primereact para el manejo " +
            "de componentes de interfaz de usuario profesionales",
         fecha: "2026-01-21"
      },
      {
         descripcion: "Se usa IndexedDB para simular el backend, " +
            "permitiendo que todas las transacciones se realicen de forma local",
         fecha: "2026-01-26"
      },
      {
         descripcion: "Se implemento una simulación de seguridad " +
            "basada en accessToken y refreshToken (Silent Refresh)",
         fecha: "2026-02-03"
      },
      {
         descripcion: "Se agrego un componente de SessionTimeout " +
            "para el control automático de la inactividad del usuario",
         fecha: "2026-01-31"
      },
      {
         descripcion: "Abstracción de la capa de datos utilizando el " +
            "patrón Repository para mayor escalabilidad",
         fecha: "2026-01-26"
      },
      {
         descripcion: "Diseño responsivo y estética premium " +
            "desarrollado íntegramente con Tailwind CSS v4",
         fecha: "2026-01-21"
      },
      {
         descripcion: "Gestión centralizada de autenticación " +
            "y configuración global mediante Context API",
         fecha: "2026-01-21"
      },
      {
         descripcion: "Implementación de react-router-dom para " +
            "manejo de rutas y navegación",
         fecha: "2026-01-25"
      }
   ]

   return (
      <Fragment>
         <HeaderText>Contenido</HeaderText>
         <p className="text-lg mb-4">
            Esta aplicación es una <b>demo</b> de un sistema de inventario
            para tiendas virtuales. Su objetivo es demostrar mis capacidades
            técnicas y experiencia como ingeniero de sistemas en el desarrollo
            de aplicaciones web modernas.&nbsp;
            <a
               href="https://github.com/dubian26/PortafolioReact"
               target="_blank" rel="noopener noreferrer"
               className="underline font-bold">
               Ir al repositorio GitHub.
            </a>
         </p>
         <p className="text-lg mb-6">
            A continuacion se muestra un listado de las funcionalidades y
            tecnologías desarrolladas en esta aplicación:
         </p>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {
               caracteristicas
                  .sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .map((item, index) => (
                     <Card key={index}>
                        <div className="flex items-start gap-3">
                           <div className="shrink-0">
                              <div className="p-2">
                                 <i className="
                                 fa-solid fa-meteor text-3xl
                                 bg-linear-to-r from-orange-500 to-yellow-300 
                                 bg-clip-text text-transparent"
                                 />
                              </div>
                           </div>
                           <div className="grow">
                              <div className="text-lg leading-snug">
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

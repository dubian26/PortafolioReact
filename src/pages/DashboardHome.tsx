import { useContext, useEffect } from "react"
import { AppContext } from "../contexts/AppContext"

export const DashboardHome = () => {
   const appCtx = useContext(AppContext)

   useEffect(() => {
      appCtx.validarUsuarioSes()
   }, [appCtx])

   return (
      <div className="animate-fade-in text-center py-20">
         <div className="bg-primary/20 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-rocket text-primary text-3xl"></i>
         </div>
         <h1 className="text-3xl font-bold mb-2 text-white">Bienvenido al Dashboard</h1>
         <p className="text-gray-400 max-w-md mx-auto">
            Selecciona una opción del menú lateral para comenzar a gestionar tu portafolio.
         </p>
      </div>
   )
}

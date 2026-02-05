import { useContext, useEffect } from "react"
import { AppContext } from "../contexts/AppContext"

export const ContenidoPage = () => {
   const appCtx = useContext(AppContext)

   useEffect(() => {
      appCtx.validarUsuarioSes()
   }, [appCtx])

   return (
      <div className="animate-fade-in text-center">
         <div className="bg-primary/20 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-rocket text-primary text-3xl"></i>
         </div>
         <h1 className="text-3xl font-bold mb-2 text-white">Bienvenido</h1>
         <p className="text-gray-400 max-w-md mx-auto">
            A continuación se describe cada una de las características de la aplicación.
         </p>
         <div className="mt-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
               <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">Características</h2>
                  <ul className="text-left space-y-4">
                     <li>
                        <h3 className="text-xl font-semibold mb-2 text-white">Característica 1</h3>
                        <p className="text-gray-400">
                           Descripción de la característica 1.
                        </p>
                     </li>
                     <li>
                        <h3 className="text-xl font-semibold mb-2 text-white">Característica 2</h3>
                        <p className="text-gray-400">
                           Descripción de la característica 2.
                        </p>
                     </li>
                     <li>
                        <h3 className="text-xl font-semibold mb-2 text-white">Característica 3</h3>
                        <p className="text-gray-400">
                           Descripción de la característica 3.
                        </p>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   )
}

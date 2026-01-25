import { useMemo, useState, type ReactNode } from "react"
import { SidebarContext } from "./SidebarContext"

type Props = {
   children: ReactNode
}

export const Sidebar = ({ children }: Props) => {
   // estados
   const [expanded, setExpanded] = useState(true)
   const contextValue = useMemo(() => ({ expanded }), [expanded]);

   return (
      <aside className={`
         h-screen shrink-0 overflow-hidden transition-all
         bg-[url(/src/assets/bg-escamas.png)] bg-no-repeat bg-auto
         ${expanded ? "w-72" : "w-16"}
      `}>
         <nav className="h-full flex flex-col">
            <div className="p-3 flex justify-between items-center">
               <h1
                  onClick={() => setExpanded(curr => !curr)}
                  className={`
                     text-primary font-extrabold cursor-pointer 
                     overflow-hidden transition-all 
                     ${expanded ? "w-full" : "w-0"}`
                  }>
                  <i className="fa-solid fa-house" />
                  <span className="pl-2">Menu</span>
               </h1>
               <button
                  onClick={() => setExpanded(curr => !curr)}
                  className={`
                     size-10 min-w-10 rounded-full cursor-pointer
                     text-primary hover:bg-primary/10
                     fa-solid ${expanded ? "fa-chevron-left" : "fa-chevron-right"}
                  `}
               />
            </div>

            <SidebarContext.Provider value={contextValue}>
               <ul className="flex-1 px-3">{children}</ul>
            </SidebarContext.Provider>

            <div className="border-t border-primary flex p-3">
               <img
                  src="https://ui-avatars.com/api/?name=John+Doe&size=16"
                  className="size-10 rounded-full" alt="Logo"
               />
               <div className={`
                     flex justify-between items-center gap-2 
                     overflow-hidden transition-all
                     ${expanded ? "w-52 ml-3" : "w-0"}
                  `}>
                  <div className="w-auto leading-4">
                     <h4 className="font-semibold">Dubian Sepulveda</h4>
                     <span className="text-xs text-gray-400">dubian26@gmail.com</span>
                  </div>
                  <button
                     onClick={() => console.log("cerrar")}
                     className="
                        fa-solid fa-ellipsis-v size-10 min-w-10 rounded-full 
                        text-primary cursor-pointer hover:bg-primary/10"
                  />
               </div>
            </div>
         </nav>
      </aside>
   )
}

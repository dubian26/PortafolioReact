import { type OverlayPanel } from "primereact/overlaypanel"
import { useMemo, useRef, useState, type ReactNode } from "react"
import bgEscamas from "../../assets/bg-escamas.png"
import { OpcionesPanel } from "./OpcionesPanel"
import { SidebarContext } from "./SidebarContext"

type Props = {
   children: ReactNode
}

export const Sidebar = ({ children }: Props) => {
   // estados
   const [expanded, setExpanded] = useState(true)
   const contextValue = useMemo(() => ({ expanded }), [expanded]);
   const overlayUsua = useRef<OverlayPanel | null>(null)

   return (
      <aside
         style={{ backgroundImage: `url(${bgEscamas})` }}
         className={`
            h-screen shrink-0 overflow-hidden transition-all
            bg-no-repeat bg-auto ${expanded ? "w-72" : "w-16"}
         `}
      >
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

            <div className="border-t border-primary flex justify-end items-center p-3">
               <button
                  onClick={ev => overlayUsua.current?.toggle(ev)}
                  className="
                     fa-solid fa-cog size-10 min-w-10 rounded-full 
                     text-primary cursor-pointer hover:bg-primary/10"
               />
               <OpcionesPanel ref={overlayUsua} />
            </div>
         </nav>
      </aside>
   )
}

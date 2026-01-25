import { useContext, type ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { SidebarContext } from "./SidebarContext"

type Props = {
   icon: ReactNode
   text: ReactNode
   alert: boolean
   to?: string
}

export const SidebarItem = ({ icon, text, alert, to = "/" }: Props) => {
   const { expanded } = useContext(SidebarContext)

   return (
      <NavLink
         to={to}
         className={({ isActive }) => `
            relative flex items-center px-3 py-2 my-1 
            font-medium rounded-md cursor-pointer transition-colors group
            ${isActive ?
               'bg-linear-to-tr from-primary/10 to-primary/50 text-white border-r-4 border-primary' :
               'hover:bg-primary/10 text-gray-400'
            }
         `}
      >
         {icon}
         <span className={`
            overflow-hidden transition-all 
            ${expanded ? "w-52 ml-3" : "w-0"}`
         }>
            {text}
         </span>

         {alert && (
            <div className={`
               absolute right-2 size-2 rounded bg-primary 
               ${expanded ? "" : "top-2"}`
            } />
         )}

         {!expanded && (
            <div
               className={`
                  absolute left-full rounded-md px-2 py-1 ml-6
                  bg-primary-100 text-primary-600 text-sm
                  invisible opacity-20 -translate-x-3 transition-all
                  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
               `}
            >
               {text}
            </div>
         )}
      </NavLink>
   )
}

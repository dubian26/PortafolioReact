import type { ReactNode } from "react"

type Props = {
   children: ReactNode
}
export const HeaderText = ({ children }: Props) => {
   return (
      <h1 className="
         text-3xl font-bold mb-3 
         bg-linear-to-r from-blue-500 to-yellow-50 
         bg-clip-text text-transparent">
         {children}
      </h1>
   )
}

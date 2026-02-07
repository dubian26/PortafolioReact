import type { ReactNode } from "react"

type Props = {
   children: ReactNode
}
export const HeaderText = ({ children }: Props) => {
   return (
      <h1 className="
         text-3xl font-bold mb-3 inline-block 
         bg-linear-to-r from-blue-500 via-cyan-400 to-cyan-200 
         bg-clip-text text-transparent">
         {children}
      </h1>
   )
}

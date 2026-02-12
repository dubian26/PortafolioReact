import { HeaderText } from "../components/common/HeaderText"
import { OrdenList } from "../components/ordenes/OrdenList"

export const OrdenesPage = () => {
   return (
      <div className="p-4">
         <HeaderText>Mis Ordenes y Facturas</HeaderText>
         <OrdenList />
      </div>
   )
}

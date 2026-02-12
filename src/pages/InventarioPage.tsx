import { Fragment } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { ProductoList } from "../components/productos/ProductoList"

export const InventarioPage = () => {
   return (
      <Fragment>
         <HeaderText>Gestión de Inventario</HeaderText>
         <ProductoList />
      </Fragment>
   )
}

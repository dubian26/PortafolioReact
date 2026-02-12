import { Fragment } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { OrdenList } from "../components/ordenes/OrdenList"

export const OrdenesPage = () => {
   return (
      <Fragment>
         <HeaderText>Mis Ordenes y Facturas</HeaderText>
         <OrdenList />
      </Fragment>
   )
}

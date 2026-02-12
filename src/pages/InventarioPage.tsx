import { HeaderText } from "../components/common/HeaderText"
import { ProductoList } from "../components/productos/ProductoList"

export const InventarioPage = () => {
   return (
      <div className="p-4">
         <HeaderText>Gestión de Inventario</HeaderText>
         <ProductoList />
      </div>
   )
}

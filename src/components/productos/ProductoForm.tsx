import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { useEffect, useState } from "react"
import { type Producto } from "../../models/ProductoModel"

interface Props {
   producto?: Producto
   onSave: (producto: Producto) => void
   onCancel: () => void
}

const emptyProduct: Producto = {
   codigo: "",
   nombre: "",
   precio: 0,
   stock: 0,
   categoria: "",
   descripcion: ""
}

export const ProductoForm = ({ producto, onSave, onCancel }: Props) => {
   const [data, setData] = useState<Producto>(emptyProduct)
   const [submitted, setSubmitted] = useState(false)

   useEffect(() => {
      if (producto) {
         setData(producto)
      } else {
         setData(emptyProduct)
      }
   }, [producto])

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
      const val = (e.target && e.target.value) || ""
      setData(prev => ({ ...prev, [name]: val }))
   }

   const onInputNumberChange = (e: any, name: string) => {
      const val = e.value || 0
      setData(prev => ({ ...prev, [name]: val }))
   }

   const saveProduct = () => {
      setSubmitted(true)

      if (data.nombre.trim() && data.codigo.trim()) {
         onSave(data)
      }
   }

   return (
      <div className="p-fluid">
         <div className="field">
            <label htmlFor="codigo" className="font-bold">Código</label>
            <InputText
               id="codigo"
               value={data.codigo}
               onChange={(e) => onInputChange(e, "codigo")}
               required
               autoFocus
               className={classNames({ "p-invalid": submitted && !data.codigo })}
            />
            {submitted && !data.codigo && <small className="p-error">El código es requerido.</small>}
         </div>

         <div className="field">
            <label htmlFor="nombre" className="font-bold">Nombre</label>
            <InputText
               id="nombre"
               value={data.nombre}
               onChange={(e) => onInputChange(e, "nombre")}
               required
               className={classNames({ "p-invalid": submitted && !data.nombre })}
            />
            {submitted && !data.nombre && <small className="p-error">El nombre es requerido.</small>}
         </div>

         <div className="field">
            <label htmlFor="descripcion" className="font-bold">Descripción</label>
            <InputText
               id="descripcion"
               value={data.descripcion}
               onChange={(e) => onInputChange(e, "descripcion")}
            />
         </div>

         <div className="field">
            <label htmlFor="categoria" className="font-bold">Categoría</label>
            <InputText
               id="categoria"
               value={data.categoria}
               onChange={(e) => onInputChange(e, "categoria")}
            />
         </div>

         <div className="formgrid grid">
            <div className="field col">
               <label htmlFor="precio" className="font-bold">Precio</label>
               <InputNumber
                  id="precio"
                  value={data.precio}
                  onValueChange={(e) => onInputNumberChange(e, "precio")}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
               />
            </div>
            <div className="field col">
               <label htmlFor="stock" className="font-bold">Stock</label>
               <InputNumber
                  id="stock"
                  value={data.stock}
                  onValueChange={(e) => onInputNumberChange(e, "stock")}
                  maxFractionDigits={0}
               />
            </div>
         </div>

         <div className="flex justify-content-end gap-2 mt-4">
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={onCancel} className="p-button-secondary" />
            <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
         </div>
      </div>
   )
}

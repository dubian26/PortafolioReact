import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"
import { type Producto } from "../../models/ProductoModel"
import { productoRepository } from "../../repositories/ProductoRepository"
import { ProductoForm } from "./ProductoForm"

export const ProductoList = () => {
   const [productos, setProductos] = useState<Producto[]>([])
   const [productDialog, setProductDialog] = useState(false)
   const [deleteProductDialog, setDeleteProductDialog] = useState(false)
   const [producto, setProducto] = useState<Producto | undefined>(undefined)
   const toast = useRef<Toast>(null)

   const cargarProductos = async () => {
      try {
         const data = await productoRepository.listarTodos()
         setProductos(data)
      } catch {
         toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar los productos", life: 3000 })
      }
   }

   useEffect(() => {
      cargarProductos()
   }, [])

   const openNew = () => {
      setProducto(undefined)
      setProductDialog(true)
   }

   const hideDialog = () => {
      setProductDialog(false)
      setDeleteProductDialog(false)
   }

   const editProduct = (prod: Producto) => {
      setProducto({ ...prod })
      setProductDialog(true)
   }

   const confirmDeleteProduct = (prod: Producto) => {
      setProducto(prod)
      setDeleteProductDialog(true)
   }

   const deleteProduct = async () => {
      if (producto && producto.id) {
         try {
            await productoRepository.eliminar(producto.id)
            setDeleteProductDialog(false)
            setProducto(undefined)
            toast.current?.show({ severity: "success", summary: "Exitoso", detail: "Producto Eliminado", life: 3000 })
            cargarProductos()
         } catch {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Error al eliminar", life: 3000 })
         }
      }
   }

   const saveProduct = async (prod: Producto) => {
      try {
         if (prod.id) {
            await productoRepository.actualizar(prod)
            toast.current?.show({ severity: "success", summary: "Exitoso", detail: "Producto Actualizado", life: 3000 })
         } else {
            await productoRepository.agregar(prod)
            toast.current?.show({ severity: "success", summary: "Exitoso", detail: "Producto Creado", life: 3000 })
         }
         setProductDialog(false)
         setProducto(undefined)
         cargarProductos()
      } catch {
         toast.current?.show({ severity: "error", summary: "Error", detail: "Error al guardar", life: 3000 })
      }
   }

   const leftToolbarTemplate = () => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button label="Nuevo" icon="fa-solid fa-plus" severity="success" onClick={openNew} />
         </div>
      )
   }

   const actionBodyTemplate = (rowData: Producto) => {
      return (
         <div className="flex gap-2">
            <button
               onClick={() => editProduct(rowData)}
               className="
                  size-10 min-w-10 rounded-full cursor-pointer 
                  text-blue-500 hover:bg-blue-500/10 fa-solid fa-pencil"
               title="Editar"
            />
            <button
               onClick={() => confirmDeleteProduct(rowData)}
               className="
                  size-10 min-w-10 rounded-full cursor-pointer 
                  text-red-500 hover:bg-red-500/10 fa-solid fa-trash"
               title="Eliminar"
            />
         </div>
      )
   }

   const priceBodyTemplate = (rowData: Producto) => {
      return rowData.precio.toLocaleString("en-US", { style: "currency", currency: "USD" })
   }

   const deleteProductDialogFooter = (
      <>
         <Button label="No" icon="fa-solid fa-times" outlined onClick={hideDialog} />
         <Button label="Si" icon="fa-solid fa-check" severity="danger" onClick={deleteProduct} />
      </>
   )

   return (
      <div>
         <Toast ref={toast} />
         <div className="card">
            <Toolbar className="mb-4 bg-transparent border-none p-0" left={leftToolbarTemplate}></Toolbar>

            <DataTable
               value={productos}
               dataKey="id"
               paginator
               rows={10}
               rowsPerPageOptions={[5, 10, 25]}
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
               className="p-datatable-sm"
               pt={{
                  header: { className: "bg-transparent border-b border-white/10" },
                  wrapper: { className: "bg-transparent" },
                  thead: { className: "bg-white/5" },
                  column: {
                     headerCell: { className: "bg-transparent text-gray-300 font-semibold border-b border-white/10 p-2" },
                     bodyCell: { className: "text-gray-400 border-b border-white/5 p-2" }
                  },
                  paginator: {
                     root: { className: "bg-transparent border-t border-white/10 p-2" }
                  }
               }}
            >
               <Column field="codigo" header="Código" sortable style={{ minWidth: "8rem" }}></Column>
               <Column field="nombre" header="Nombre" sortable style={{ minWidth: "16rem" }}></Column>
               <Column field="precio" header="Precio" body={priceBodyTemplate} sortable style={{ minWidth: "8rem" }}></Column>
               <Column field="category" header="Categoría" sortable style={{ minWidth: "10rem" }}></Column>
               <Column field="stock" header="Stock" sortable style={{ minWidth: "8rem" }}></Column>
               <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: "8rem" }}></Column>
            </DataTable>
         </div>

         <Dialog visible={productDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Detalle Producto" modal className="p-fluid" onHide={hideDialog}>
            <ProductoForm producto={producto} onSave={saveProduct} onCancel={hideDialog} />
         </Dialog>

         <Dialog visible={deleteProductDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDialog}>
            <div className="confirmation-content">
               <i className="fa-solid fa-triangle-exclamation mr-3" style={{ fontSize: "2rem" }} />
               {producto && (
                  <span>
                     ¿Estás seguro que deseas eliminar <b>{producto.nombre}</b>?
                  </span>
               )}
            </div>
         </Dialog>
      </div>
   )
}

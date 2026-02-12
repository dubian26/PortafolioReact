import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { type ProductoModel } from "../../models/ProductoModel"
import { productoRepository } from "../../repositories/ProductoRepository"
import { ProductoForm } from "./ProductoForm"

export const ProductoList = () => {
   const { config, mostrarError, mostrarMensaje } = useContext(AppContext)
   const [productos, setProductos] = useState<ProductoModel[]>([])
   const [productDialog, setProductDialog] = useState(false)
   const [deleteProductDialog, setDeleteProductDialog] = useState(false)
   const [producto, setProducto] = useState<ProductoModel | undefined>(undefined)
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      productoRepository.asignarConfig(config)
   }, [config])

   const cargarProductos = useCallback(async () => {
      try {
         setLoading(true)
         const data = await productoRepository.listarTodos()
         setProductos(data)
      } catch {
         mostrarError("No se pudieron cargar los productos")
      } finally {
         setLoading(false)
      }
   }, [mostrarError])

   useEffect(() => {
      cargarProductos()
   }, [cargarProductos])

   const openNew = () => {
      setProducto(undefined)
      setProductDialog(true)
   }

   const hideDialog = () => {
      setProductDialog(false)
      setDeleteProductDialog(false)
   }

   const editProduct = (prod: ProductoModel) => {
      setProducto({ ...prod })
      setProductDialog(true)
   }

   const confirmDeleteProduct = (prod: ProductoModel) => {
      setProducto(prod)
      setDeleteProductDialog(true)
   }

   const deleteProduct = async () => {
      if (!producto?.id) return

      try {
         await productoRepository.eliminar(producto.id)
         setDeleteProductDialog(false)
         setProducto(undefined)
         mostrarMensaje("Producto Eliminado")
         cargarProductos()
      } catch {
         mostrarError("Error al eliminar el producto")
      }
   }

   const saveProduct = async (prod: ProductoModel) => {
      try {
         if (prod.id) {
            await productoRepository.actualizar(prod)
            mostrarMensaje("Producto Actualizado")
         } else {
            await productoRepository.agregar(prod)
            mostrarMensaje("Producto Creado")
         }
         setProductDialog(false)
         setProducto(undefined)
         cargarProductos()
      } catch {
         mostrarError("Error al guardar el producto")
      }
   }

   const actionBodyTemplate = (rowData: ProductoModel) => {
      return (
         <div className="flex gap-2">
            <button
               onClick={() => editProduct(rowData)}
               title="Editar" className="
                  size-10 min-w-10 rounded-full cursor-pointer 
                  text-blue-500 hover:bg-blue-500/10 fa-solid fa-pencil"
            />
            <button
               onClick={() => confirmDeleteProduct(rowData)}
               title="Eliminar" className=" 
                  size-10 min-w-10 rounded-full cursor-pointer 
                  text-red-500 hover:bg-red-500/10 fa-solid fa-trash"
            />
         </div>
      )
   }

   const priceBodyTemplate = (rowData: ProductoModel) => {
      return rowData.precio.toLocaleString("en-US", { style: "currency", currency: "USD" })
   }

   const deleteProductDialogFooter = (
      <Fragment>
         <Button label="No" icon="fa-solid fa-times" outlined onClick={hideDialog} />
         <Button label="Si" icon="fa-solid fa-check" severity="danger" onClick={deleteProduct} />
      </Fragment>
   )

   return (
      <Fragment>
         <div className="card">
            <div className="flex justify-end gap-2 mb-4">
               <Button
                  label="Nuevo"
                  icon="fa-solid fa-cloud-arrow-up"
                  onClick={openNew}
               />
            </div>

            <DataTable
               loading={loading} value={productos}
               dataKey="id" paginator={true}
               rows={10} rowsPerPageOptions={[5, 10, 25]}
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
            <ProductoForm key={producto?.id ?? "new"} producto={producto} onSave={saveProduct} onCancel={hideDialog} />
         </Dialog>

         <Dialog visible={deleteProductDialog} style={{ width: "32rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDialog}>
            <div className="confirmation-content">
               <i className="fa-solid fa-triangle-exclamation mr-3" style={{ fontSize: "2rem" }} />
               {
                  producto &&
                  <span>
                     ¿Estás seguro que deseas eliminar <b>{producto.nombre}</b>?
                  </span>
               }
            </div>
         </Dialog>
      </Fragment>
   )
}

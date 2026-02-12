import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Tag } from "primereact/tag"
import { Toast } from "primereact/toast"
import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { type Factura } from "../../models/FacturaModel"
import { type Orden } from "../../models/OrdenModel"
import { facturaRepository } from "../../repositories/FacturaRepository"
import { ordenRepository } from "../../repositories/OrdenRepository"
import { FacturaDetalle } from "../facturas/FacturaDetalle"

export const OrdenList = () => {
   const [ordenes, setOrdenes] = useState<Orden[]>([])
   const [factura, setFactura] = useState<Factura | null>(null)
   const [facturaDialog, setFacturaDialog] = useState(false)
   const { usuarioSesion } = useContext(AppContext)
   const toast = useRef<Toast>(null)

   useEffect(() => {
      const cargarOrdenes = async () => {
         if (usuarioSesion?.id) {
            try {
               const data = await ordenRepository.listarPorUsuario(usuarioSesion.id)
               // Ordenar por fecha descendente
               data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
               setOrdenes(data)
            } catch {
               toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar las ordenes", life: 3000 })
            }
         }
      }

      if (usuarioSesion) {
         cargarOrdenes()
      }
   }, [usuarioSesion])

   const verFactura = async (orden: Orden) => {
      if (orden.id) {
         try {
            const fact = await facturaRepository.buscarPorOrdenId(orden.id)
            if (fact) {
               setFactura(fact)
               setFacturaDialog(true)
            } else {
               toast.current?.show({ severity: "warn", summary: "Aviso", detail: "No se encontró factura para esta orden", life: 3000 })
            }
         } catch {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Error al buscar factura", life: 3000 })
         }
      }
   }

   const dateBodyTemplate = (rowData: Orden) => {
      return new Date(rowData.fecha).toLocaleDateString() + " " + new Date(rowData.fecha).toLocaleTimeString()
   }

   const priceBodyTemplate = (rowData: Orden) => {
      return rowData.total.toLocaleString("en-US", { style: "currency", currency: "USD" })
   }

   const statusBodyTemplate = (rowData: Orden) => {
      return <Tag value={rowData.estado} severity={getProductSeverity(rowData)}></Tag>
   }

   const getProductSeverity = (orden: Orden) => {
      switch (orden.estado) {
         case "Confirmada":
            return "success"
         case "Pendiente":
            return "warning"
         case "Cancelada":
            return "danger"
         default:
            return null
      }
   }

   const actionBodyTemplate = (rowData: Orden) => {
      return (
         <button
            onClick={() => verFactura(rowData)}
            className="
               size-10 min-w-10 rounded-full cursor-pointer 
               text-blue-500 hover:bg-blue-500/10 fa-solid fa-file"
            title="Ver Factura"
         />
      )
   }

   return (
      <div className="card">
         <Toast ref={toast} />
         <DataTable
            value={ordenes}
            paginator
            rows={10}
            stripedRows
            emptyMessage="No has realizado ordenes aún."
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
            <Column field="id" header="Orden #" style={{ minWidth: "8rem" }}></Column>
            <Column field="fecha" header="Fecha" body={dateBodyTemplate} style={{ minWidth: "12rem" }}></Column>
            <Column field="total" header="Total" body={priceBodyTemplate} style={{ minWidth: "8rem" }}></Column>
            <Column field="estado" header="Estado" body={statusBodyTemplate} style={{ minWidth: "10rem" }}></Column>
            <Column body={actionBodyTemplate} style={{ minWidth: "6rem" }}></Column>
         </DataTable>

         <Dialog visible={facturaDialog} style={{ width: "50rem" }} breakpoints={{ "960px": "75vw", "641px": "90vw" }} modal onHide={() => setFacturaDialog(false)}>
            {factura && <FacturaDetalle factura={factura} onClose={() => setFacturaDialog(false)} />}
         </Dialog>
      </div>
   )
}

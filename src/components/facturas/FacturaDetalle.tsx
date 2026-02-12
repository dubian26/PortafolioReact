import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Panel } from "primereact/panel"
import { useRef } from "react"
import { type Factura } from "../../models/FacturaModel"

interface Props {
   factura: Factura
   onClose?: () => void
}

export const FacturaDetalle = ({ factura, onClose }: Props) => {
   const printRef = useRef<HTMLDivElement>(null)

   const handlePrint = () => {
      const printContent = printRef.current
      if (printContent) {
         const originalContents = document.body.innerHTML
         document.body.innerHTML = printContent.innerHTML
         window.print()
         document.body.innerHTML = originalContents
         window.location.reload() // Recargar para restaurar eventos de React (solución simple)
      }
   }

   const priceBodyTemplate = (rowData: { precioUnitario: number }) => {
      return rowData.precioUnitario?.toLocaleString("en-US", { style: "currency", currency: "USD" })
   }

   const subtotalBodyTemplate = (rowData: { subtotal: number }) => {
      return rowData.subtotal?.toLocaleString("en-US", { style: "currency", currency: "USD" })
   }

   return (
      <div className="p-4" ref={printRef}>
         <Panel header={`Factura ${factura.numeroFactura}`}>
            <div className="grid">
               <div className="col-6">
                  <p><strong>Fecha:</strong> {factura.fecha.toLocaleDateString()}</p>
                  <p><strong>Cliente:</strong> {factura.clienteNombre}</p>
                  <p><strong>NIT/CF:</strong> {factura.clienteNit}</p>
               </div>
               <div className="col-6 text-right">
                  <h2 className="text-primary">TOTAL: {factura.total.toLocaleString("en-US", { style: "currency", currency: "USD" })}</h2>
               </div>
            </div>

            <DataTable value={factura.items} className="mt-4" showGridlines>
               <Column field="productoNombre" header="Producto"></Column>
               <Column field="cantidad" header="Cantidad"></Column>
               <Column field="precioUnitario" header="Precio Unitario" body={priceBodyTemplate}></Column>
               <Column field="subtotal" header="Subtotal" body={subtotalBodyTemplate}></Column>
            </DataTable>

            <div className="mt-4 no-print flex justify-content-end gap-2">
               {onClose && <Button label="Cerrar" icon="fa-solid fa-times" outlined onClick={onClose} />}
               <Button label="Imprimir" icon="fa-solid fa-print" onClick={handlePrint} />
            </div>
         </Panel>
         <style>{`
                @media print {
                    .no-print { display: none; }
                    .p-panel-header { background-color: white !important; border: none !important; }
                    .p-panel-content { border: none !important; }
                }
            `}</style>
      </div>
   )
}

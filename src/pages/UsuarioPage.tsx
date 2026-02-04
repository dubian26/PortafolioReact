import { FilterMatchMode } from "primereact/api"
import { Column } from "primereact/column"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useEffect, useState } from "react"
import { dateUtility } from "../appconfig/DateUtility"
import { usuarioRepository } from "../db/repositories/UsuarioRepository"
import { type UsuarioModel } from "../models/UsuarioModel"

export const UsuarioPage = () => {
   const [usuarios, setUsuarios] = useState<UsuarioModel[]>([])
   const [loading, setLoading] = useState(true)
   const [globalFilterValue, setGlobalFilterValue] = useState("")
   const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
   })

   const cargarUsuarios = async () => {
      try {
         setLoading(true)
         const data = await usuarioRepository.listarTodos()
         setUsuarios(data)
      } catch (error) {
         console.error("Error al cargar usuarios:", error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      cargarUsuarios()
   }, [])

   const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const _filters = { ...filters }

      // @ts-expect-error: PrimeReact DataTableFilterMeta types are strict
      _filters["global"].value = value

      setFilters(_filters)
      setGlobalFilterValue(value)
   }

   const renderHeader = () => {
      return (
         <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-white">Lista de Usuarios</h2>
            <IconField iconPosition="left">
               <InputIcon className="pi pi-search" />
               <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Buscar usuario..."
                  className="w-full sm:w-80"
               />
            </IconField>
         </div>
      )
   }

   return (
      <div className="animate-fade-in p-4">
         <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Usuarios</h1>
         <div className="card bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <DataTable
               value={usuarios}
               paginator
               rows={10}
               dataKey="id"
               filters={filters}
               filterDisplay="menu"
               loading={loading}
               globalFilterFields={["nombre", "email", "id"]}
               header={renderHeader()}
               emptyMessage="No se encontraron usuarios."
               className="p-datatable-sm"
               rowsPerPageOptions={[5, 10, 25, 50]}
               pt={{
                  header: { className: "bg-transparent border-b border-white/10 p-6" },
                  wrapper: { className: "bg-transparent" },
                  thead: { className: "bg-white/5" },
                  column: {
                     headerCell: { className: "bg-transparent text-gray-300 font-semibold border-b border-white/10 p-4" },
                     bodyCell: { className: "text-gray-400 border-b border-white/5 p-4" }
                  },
                  paginator: {
                     root: { className: "bg-transparent border-t border-white/10 p-4" }
                  }
               }}
            >
               <Column field="id" header="ID" sortable style={{ width: "10%" }} />
               <Column field="nombre" header="Nombre" sortable style={{ width: "30%" }} />
               <Column field="email" header="Correo Electrónico" sortable style={{ width: "35%" }} />
               <Column
                  field="fechaReg"
                  header="Fecha Registro"
                  body={rowData => dateUtility.formatFecha(rowData.fechaReg)}
                  sortable
                  style={{ width: "25%" }}
               />
            </DataTable>
         </div>
      </div>
   )
}

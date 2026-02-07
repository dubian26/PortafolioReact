import { FilterMatchMode } from "primereact/api"
import { Column } from "primereact/column"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Fragment, useEffect, useState } from "react"
import { dateUtility } from "../appconfig/DateUtility"
import { HeaderText } from "../components/common/HeaderText"
import { EditarUsuario } from "../components/usuario/EditarUsuario"
import { usuarioRepository } from "../db/repositories/UsuarioRepository"
import { type UsuarioModel } from "../models/UsuarioModel"

export const UsuarioPage = () => {
   const [usuarios, setUsuarios] = useState<UsuarioModel[]>([])
   const [loading, setLoading] = useState(true)
   const [globalFilterValue, setGlobalFilterValue] = useState("")
   const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
   })
   const [editDialogVisible, setEditDialogVisible] = useState(false)
   const [selectedUserId, setSelectedUserId] = useState<number | string | null>(null)

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

   const handleAbrirEditarUsu = (id: number | string) => {
      setSelectedUserId(id)
      setEditDialogVisible(true)
   }

   const handleCerrarEditarUsu = () => {
      setEditDialogVisible(false)
      setSelectedUserId(null)
   }

   const handleUsuActualizado = () => {
      handleCerrarEditarUsu()
      cargarUsuarios()
   }

   const renderHeader = () => {
      return (
         <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-white">Lista de Usuarios</h2>
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-search" />
               <InputText
                  placeholder="Buscar usuario..."
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  className="p-inputtext-sm w-full sm:w-80"
               />
            </IconField>
         </div>
      )
   }

   const actionBodyTemplate = (rowData: UsuarioModel) => (
      <div className="flex gap-2">
         <button
            onClick={() => rowData.id && handleAbrirEditarUsu(rowData.id)}
            className="
               size-10 min-w-10 rounded-full cursor-pointer 
               text-primary hover:bg-primary/10 fa-solid fa-pencil"
         />
      </div>
   )

   return (
      <Fragment>
         <HeaderText>Gestión de Usuarios</HeaderText>
         <div className="card">
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
               <Column field="id" header="ID" sortable style={{ width: "10%" }} />
               <Column field="nombre" header="Nombre" sortable style={{ width: "30%" }} />
               <Column field="email" header="Correo Electrónico" sortable style={{ width: "35%" }} />
               <Column
                  field="fechaReg"
                  header="Fecha Registro"
                  body={rowData => dateUtility.formatFecha(rowData.fechaReg)}
                  sortable
                  style={{ width: "15%" }}
               />
               <Column
                  header="Acciones"
                  body={actionBodyTemplate}
                  exportable={false}
                  style={{ width: "10%" }}
               />
            </DataTable>
         </div>

         <Dialog
            header={<HeaderText>Editar Usuario</HeaderText>}
            visible={editDialogVisible}
            style={{ width: "50vw" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            onHide={handleCerrarEditarUsu}
         >
            {
               selectedUserId && (
                  <EditarUsuario
                     id={selectedUserId}
                     onUpdate={handleUsuActualizado}
                  />
               )
            }
         </Dialog>
      </Fragment>
   )
}


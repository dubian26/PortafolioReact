import { Dialog } from "primereact/dialog"
import { Menu } from "primereact/menu"
import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, useState, type RefObject } from "react"
import { AppContext } from "../../contexts/AppContext"
import { ConfigForm } from "../common/ConfigForm"
import { HeaderText } from "../common/HeaderText"
import { EditarUsuario } from "../usuario/EditarUsuario"

type Props = {
   ref: RefObject<OverlayPanel | null>
}

export const PerfilDialog = ({ ref }: Props) => {
   const { usuarioSesion, logout } = useContext(AppContext)
   const [editDialogVisible, setEditDialogVisible] = useState(false)
   const [configDialogVisible, setConfigDialogVisible] = useState(false)

   const handleAbrirEditarUsu = () => {
      setEditDialogVisible(true)
   }

   const handleCerrarEditarUsu = () => {
      setEditDialogVisible(false)
   }

   const handleUsuActualizado = () => {
      handleCerrarEditarUsu()
      logout()
   }

   const handleAbrirConfigDialog = () => {
      setConfigDialogVisible(true)
   }

   const handleCerrarConfigDialog = () => {
      setConfigDialogVisible(false)
   }

   const handleConfigActualizado = () => {
      handleCerrarConfigDialog()
      logout()
   }

   return (
      <OverlayPanel ref={ref}>
         <div className="p-2">
            <div className="font-bold">{usuarioSesion?.nombre}</div>
            <div>{usuarioSesion?.email}</div>
         </div>
         <Menu
            pt={{ root: { className: "border-0 bg-transparent" } }}
            model={[
               {
                  label: "Perfil", icon: "fa-solid fa-user",
                  command: () => handleAbrirEditarUsu()
               },
               {
                  label: "Configuración", icon: "fa-solid fa-gear",
                  command: () => handleAbrirConfigDialog()
               },
               {
                  label: "Cerrar Sesión", icon: "fa-solid fa-sign-out",
                  command: () => logout()
               }
            ]}
         />
         <Dialog
            header={<HeaderText>Parametros del Sistema</HeaderText>}
            visible={configDialogVisible}
            className="w-11/12 lg:w-3/4 xl:w-2/3"
            onHide={handleCerrarConfigDialog}
         >
            <ConfigForm onSave={handleConfigActualizado} />
         </Dialog>
         <Dialog
            header={<HeaderText>Editar Usuario</HeaderText>}
            visible={editDialogVisible}
            className="w-11/12 lg:w-3/4 xl:w-2/3"
            onHide={handleCerrarEditarUsu}
         >
            <EditarUsuario
               id={usuarioSesion?.id ?? 0}
               onUpdate={handleUsuActualizado}
            />
         </Dialog>
      </OverlayPanel>
   )
}

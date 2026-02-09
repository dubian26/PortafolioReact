import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Fragment, useContext, useEffect, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { type ConfigModel } from "../../models/ConfigModel"

type Props = {
   onSave: () => void
}

export const ConfigForm = ({ onSave }: Props) => {
   const {
      config, updateConfig, resetConfig,
      mostrarMensaje, mostrarError
   } = useContext(AppContext)

   const [formData, setFormData] = useState<ConfigModel>(config)
   const [changed, setChanged] = useState(false)
   const [saving, setSaving] = useState(false)

   useEffect(() => {
      setFormData(config)
      setChanged(false)
   }, [config])

   const handleChange = (key: keyof ConfigModel, value: string | number | null | undefined) => {
      setFormData(prev => {
         const newData = { ...prev, [key]: value }
         setChanged(JSON.stringify(newData) !== JSON.stringify(config))
         return newData
      })
   }

   const handleSave = async () => {
      try {
         if (!changed) {
            mostrarMensaje("No hay cambios para guardar")
            return
         }

         setSaving(true)
         await updateConfig(formData)
         mostrarMensaje("Configuración actualizada correctamente")
         setChanged(false)
         onSave()
      } catch (error) {
         console.error(error)
         mostrarError("Error al guardar la configuración")
      } finally {
         setSaving(false)
      }
   }

   const handleReset = async () => {
      try {
         setSaving(true)
         await resetConfig()
         mostrarMensaje("Configuración restaurada a valores por defecto")
      } catch (error) {
         console.error(error)
         mostrarError("Error al restaurar configuración")
      } finally {
         setSaving(false)
      }
   }

   return (
      <Fragment>
         <div className="grid grid-cols-12 gap-3">

            <div className="col-span-12 md:col-span-6">
               <label htmlFor="mockDelay" className="text-sm pl-1">
                  Simular tiempo en http requests:
               </label>
               <InputText
                  id="mockDelay" value={formData.mockRequestDelay}
                  onChange={(e) => handleChange("mockRequestDelay", e.target.value)}
                  className="w-full"
               />
            </div>

            <div className="col-span-12 md:col-span-6">
               <label htmlFor="expAccess" className="text-sm pl-1">
                  Expiración Access Token:
               </label>
               <InputText
                  id="expAccess" value={formData.expAccessToken}
                  onChange={(e) => handleChange("expAccessToken", e.target.value)}
                  className="w-full"
               />
            </div>

            <div className="col-span-12 md:col-span-6">
               <label htmlFor="expRefresh" className="text-sm pl-1">
                  Expiración Refresh Token:
               </label>
               <InputText
                  id="expRefresh" value={formData.expRefreshToken}
                  onChange={(e) => handleChange("expRefreshToken", e.target.value)}
                  className="w-full"
               />
            </div>

            <div className="col-span-12 md:col-span-6">
               <label htmlFor="sessionTimeout" className="text-sm pl-1">
                  Tiempo espera para cerrar sesion por inactividad:
               </label>
               <InputText
                  id="sessionTimeout" value={formData.sessionTimeout}
                  onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                  className="w-full"
               />
            </div>

            <div className="col-span-12 md:col-span-6">
               <label htmlFor="sessionWarning" className="text-sm pl-1">
                  Avisar antes de cerrar sesion:
               </label>
               <InputText
                  id="sessionWarning" value={formData.sessionWarning}
                  onChange={(e) => handleChange("sessionWarning", e.target.value)}
                  className="w-full"
               />
            </div>
         </div>

         <div className="flex justify-end gap-2 mt-4">
            <Button
               label="Restaurar por defecto"
               icon="fa-solid fa-refresh"
               severity="secondary"
               onClick={handleReset}
               disabled={saving}
            />
            <Button
               label="Guardar Cambios"
               icon="fa-solid fa-save"
               onClick={handleSave}
               loading={saving}
            />
         </div>
      </Fragment>
   )
}

import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { usuarioRepository } from "../../repositories/UsuarioRepository"
import { type UsuarioModel } from "../../models/UsuarioModel"

type Props = {
   id: number | string
   onUpdate?: () => void
}

export const EditarUsuario = ({ id, onUpdate }: Props) => {
   const appCtx = useContext(AppContext)
   const [nombre, setNombre] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [confirPassword, setConfirPassword] = useState("")
   const [loading, setLoading] = useState(false)
   const [originalUsuario, setOriginalUsuario] = useState<UsuarioModel | null>(null)
   const op = useRef<OverlayPanel>(null)

   useEffect(() => {
      const cargarUsuario = async () => {
         try {
            setLoading(true)
            const usuario = await usuarioRepository.buscarPorId(id)
            if (usuario) {
               setOriginalUsuario(usuario)
               setNombre(usuario.nombre)
               setEmail(usuario.email)
               // No cargamos el password por seguridad y para que se entienda que si lo deja vacio no se cambia
            } else {
               appCtx.mostrarError("Usuario no encontrado")
            }
         } catch (error) {
            console.error(error)
            appCtx.mostrarError("Error al cargar usuario")
         } finally {
            setLoading(false)
         }
      }

      if (id) {
         cargarUsuario()
      }
   }, [id, appCtx])

   const checkPasswordStrength = (pass: string) => {
      let score = 0
      if (pass.length > 7) score += 1
      if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1
      if (/\d/.test(pass)) score += 1
      if (/[^A-Za-z0-9]/.test(pass)) score += 1
      return score
   }

   const strengthScore = checkPasswordStrength(password)

   const getStrengthLabel = (score: number) => {
      if (score < 2) return "Débil"
      if (score < 4) return "Moderada"
      return "Fuerte"
   }

   const getBarColorClass = (score: number, index: number) => {
      let color = "bg-gray-200"
      if (score < 2) {
         if (index === 1) color = "bg-red-400"
      } else if (score < 4) {
         if (index <= 2) color = "bg-yellow-200"
      } else {
         if (index <= 3) color = "bg-green-300"
      }
      return color
   }

   const getTextColorClass = (score: number) => {
      if (score < 2) return "text-red-400"
      if (score < 4) return "text-yellow-200"
      return "text-green-300"
   }

   const handleClickActualizar = async () => {
      if (!nombre.trim()) {
         appCtx.mostrarError("El nombre es obligatorio")
         return
      }

      if (!originalUsuario) return

      // Si el password no esta vacio, validamos y actualizamos
      if (password) {
         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/
         if (!passwordRegex.test(password)) {
            const mensaje = `
               Password debe tener: al menos una minúscula, 
               al menos una mayúscula, al menos un número, 
               al menos un caracter especial @$!%*?& y 
               mínimo 7 caracteres
            `
            appCtx.mostrarError(mensaje)
            return
         }

         if (password !== confirPassword) {
            appCtx.mostrarError("Las contraseñas no coinciden")
            return
         }
      }

      setLoading(true)

      try {
         const usuarioActualizado: UsuarioModel = {
            ...originalUsuario,
            nombre,
            // Si password tiene valor lo actualizamos, sino mantenemos el anterior
            password: password ? password : originalUsuario.password
         }

         await usuarioRepository.actualizar(usuarioActualizado)
         appCtx.mostrarMensaje("Usuario actualizado exitosamente")

         if (onUpdate) onUpdate()

         // Limpiamos campos de password
         setPassword("")
         setConfirPassword("")

      } catch (error) {
         appCtx.mostrarError("Ocurrió un error al intentar actualizar el usuario")
         console.error(error)
      } finally {
         setLoading(false)
      }
   }

   if (!originalUsuario && !loading) return null

   return (
      <div className="grid grid-cols-12 gap-2">
         <div className="col-span-12">
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-envelope" />
               <InputText
                  placeholder="Email" value={email}
                  disabled={true} className="w-full p-filled" // Read only
                  readOnly
               />
            </IconField>
         </div>

         <div className="col-span-12">
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-user" />
               <InputText
                  placeholder="Nombre completo" value={nombre}
                  disabled={loading} className="w-full"
                  onChange={(e) => setNombre(e.target.value)}
               />
            </IconField>
         </div>

         <div className="col-span-12 md:col-span-6">
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-lock" />
               <InputText
                  type="password" placeholder="Dejar en blanco para no cambiar"
                  value={password} disabled={loading} className="w-full"
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => op.current?.show(e, e.target)}
                  onBlur={() => op.current?.hide()}
               />
            </IconField>
            <OverlayPanel ref={op}>
               <div className="flex flex-col gap-2 w-full" style={{ minWidth: "250px" }}>
                  <div className="flex gap-1 h-2">
                     <div className={`flex-1 rounded-sm ${getBarColorClass(strengthScore, 1)}`}></div>
                     <div className={`flex-1 rounded-sm ${getBarColorClass(strengthScore, 2)}`}></div>
                     <div className={`flex-1 rounded-sm ${getBarColorClass(strengthScore, 3)}`}></div>
                  </div>
                  <div className={`font-bold ${getTextColorClass(strengthScore)}`}>
                     {getStrengthLabel(strengthScore)}
                  </div>
                  <Divider className="m-1" />
                  <p className="mt-1">Sugerencias:</p>
                  <ul className="pl-2 ml-2 mt-0">
                     <li>Al menos una minúscula</li>
                     <li>Al menos una mayúscula</li>
                     <li>Al menos un número</li>
                     <li>Al menos un caracter especial @$!%*?&</li>
                     <li>Mínimo 7 caracteres</li>
                  </ul>
               </div>
            </OverlayPanel>
         </div>

         <div className="col-span-12 md:col-span-6">
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-lock" />
               <InputText
                  type="password" placeholder="Confirmar nuevo password"
                  value={confirPassword} disabled={loading || !password}
                  onChange={(e) => setConfirPassword(e.target.value)}
                  className="w-full"
               />
            </IconField>
         </div>

         <div className="col-span-12 flex justify-end mt-3">
            <Button
               label="Actualizar" icon="pi pi-save"
               loading={loading} onClick={handleClickActualizar}
            />
         </div>
      </div>
   )
}


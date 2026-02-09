import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { OverlayPanel } from "primereact/overlaypanel"
import { useContext, useRef, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { usuarioRepository } from "../../repositories/UsuarioRepository"
import { type UsuarioModel } from "../../models/UsuarioModel"

export const CrearCuenta = () => {
   const appCtx = useContext(AppContext)
   const [nombre, setNombre] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [confirPassword, setConfirPassword] = useState("")
   const [loading, setLoading] = useState(false)
   const op = useRef<OverlayPanel>(null)

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

   const handleClickRegistrar = async () => {
      if (!nombre.trim()) {
         appCtx.mostrarError("El nombre es obligatorio")
         return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         appCtx.mostrarError("Email no es válido")
         return
      }

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

      setLoading(true)

      try {
         const existe = await usuarioRepository.buscarPorEmail(email)
         if (existe) {
            appCtx.mostrarError("El correo ya se encuentra registrado")
            setLoading(false)
            return
         }

         const nuevoUsuario: UsuarioModel = {
            nombre,
            email,
            password,
            fechaReg: new Date()
         }

         await usuarioRepository.agregar(nuevoUsuario)
         appCtx.mostrarMensaje("Usuario creado exitosamente")

         setNombre("")
         setEmail("")
         setPassword("")
         setConfirPassword("")

      } catch (error) {
         appCtx.mostrarError("Ocurrió un error al intentar registrar el usuario")
         console.error(error)
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="grid grid-cols-12 gap-2">
         <div className="col-span-12">
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-envelope" />
               <InputText
                  placeholder="Email" value={email}
                  disabled={loading} className="w-full"
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password" placeholder="Password" value={password}
                  disabled={loading} className="w-full"
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
                  type="password" placeholder="Confirmar password" value={confirPassword}
                  disabled={loading} className="w-full"
                  onChange={(e) => setConfirPassword(e.target.value)}
               />
            </IconField>
         </div>

         <div className="col-span-12 flex justify-end mt-3">
            <Button
               label="Registrarme" icon="pi pi-user-plus"
               loading={loading} onClick={handleClickRegistrar}
            />
         </div>
      </div>
   )
}

import { Button } from "primereact/button"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useContext, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { usuarioRepository } from "../../db/repositories/UsuarioRepository"
import { type UsuarioModel } from "../../models/UsuarioModel"

export const CrearCuenta = () => {
   const appCtx = useContext(AppContext)
   const [nombre, setNombre] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [confirPassword, setConfirPassword] = useState("")
   const [loading, setLoading] = useState(false)

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
         appCtx.mostrarError("Password debe tener al menos 7 caracteres, incluyendo letras y números")
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
         appCtx.mostrarExito("Usuario creado exitosamente")

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
               <InputIcon className="fa-solid fa-user" />
               <InputText
                  placeholder="Nombre completo" value={nombre}
                  disabled={loading} className="w-full"
                  onChange={(e) => setNombre(e.target.value)}
               />
            </IconField>
         </div>

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

         <div className="col-span-12 md:col-span-6">
            <IconField iconPosition="left">
               <InputIcon className="fa-solid fa-lock" />
               <InputText
                  type="password" placeholder="Password" value={password}
                  disabled={loading} className="w-full"
                  onChange={(e) => setPassword(e.target.value)}
               />
            </IconField>
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

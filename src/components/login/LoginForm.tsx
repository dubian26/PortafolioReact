import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useContext, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { usuarioRepository } from "../../db/repositories/UsuarioRepository"
import { CrearCuenta } from "../cuenta/CrearCuenta"

export const LoginForm = () => {
   // estados
   const appCtx = useContext(AppContext)
   const [loading, setLoading] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [visible, setVisible] = useState(false)

   // eventos
   const handleClickIngresar = async () => {
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

      setLoading(true)

      try {
         const tokenModel = await usuarioRepository.autenticar(email, password)
         if (tokenModel === undefined) throw new Error("Usuario o password incorrecto")
         sessionStorage.accessToken = tokenModel.accessToken
         sessionStorage.refreshToken = tokenModel.refreshToken
         await appCtx.validarUsuarioSes()
      } catch {
         appCtx.mostrarError("Falló la autenticación")
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="w-10/12 max-w-72 flex flex-col gap-3">
         <IconField iconPosition="left">
            <InputIcon className="fa-solid fa-envelope" />
            <InputText
               placeholder="Email" value={email}
               disabled={loading} className="w-full"
               onChange={(e) => setEmail(e.target.value)}
            />
         </IconField>
         <IconField iconPosition="left">
            <InputIcon className="fa-solid fa-lock" />
            <InputText
               type="password" placeholder="Password" value={password}
               disabled={loading} className="w-full"
               onChange={(e) => setPassword(e.target.value)}
            />
         </IconField>
         <Button
            label="Ingresar" loading={loading}
            onClick={handleClickIngresar}
         />
         <div className="pt-4">
            <Button
               label="¿Olvidó su password?" link={true} size="small"
               onClick={() => appCtx.mostrarError("Opción no implementada")}
            />
            <Button
               label="¿No tiene cuenta? Créela aquí" link={true} size="small"
               onClick={() => setVisible(true)}
            />
            <Dialog
               header="Crear cuenta" visible={visible} className="w-10/12 md:w-3/4 xl:w-1/2"
               onHide={() => { if (!visible) return; setVisible(false); }}>
               <CrearCuenta />
            </Dialog>
         </div>
      </div>
   )
}

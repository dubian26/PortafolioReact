import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { usuarioRepository } from "../../repositories/UsuarioRepository"
import { HeaderText } from "../common/HeaderText"
import { CrearCuenta } from "../cuenta/CrearCuenta"

export const LoginForm = () => {
   // estados
   const { config, mostrarError, validarUsuarioSes } = useContext(AppContext)
   const [loading, setLoading] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [visible, setVisible] = useState(false)

   useEffect(() => { usuarioRepository.asignarConfig(config) }, [config])

   // eventos
   const handleClickIngresar = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         mostrarError("Email no es válido")
         return
      }

      setLoading(true)

      try {
         const tokenModel = await usuarioRepository.autenticar(email, password)
         if (tokenModel === undefined) throw new Error("Usuario o password incorrecto")
         sessionStorage.accessToken = tokenModel.accessToken
         sessionStorage.refreshToken = tokenModel.refreshToken
         await validarUsuarioSes()
      } catch {
         mostrarError("Falló la autenticación")
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
               onClick={() => mostrarError("Opción no implementada")}
            />
            <Button
               label="¿No tiene cuenta? Créela aquí" link={true} size="small"
               onClick={() => setVisible(true)}
            />
            <Dialog
               header={<HeaderText>Crear cuenta</HeaderText>}
               visible={visible} className="w-11/12 lg:w-3/4 xl:w-2/3"
               onHide={() => { if (!visible) return; setVisible(false); }}>
               <CrearCuenta />
            </Dialog>
         </div>
      </div>
   )
}

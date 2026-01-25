import { Button } from "primereact/button"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { useContext, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { fetchLogin } from "../../requests/fetchLogin"

export const LoginForm = () => {
   // estados
   const appCtx = useContext(AppContext)
   const [loading, setLoading] = useState(false)
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")

   // eventos
   const handleClickIngresar = () => {
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
      fetchLogin({ email, password })
         .then(result => appCtx.login(result))
         .catch(error => appCtx.mostrarError(error))
         .finally(() => setLoading(false))
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
               onClick={() => console.log("olvidó su password...")}
            />
            <Button
               label="¿No tiene cuenta? Créela aquí" link={true} size="small"
               onClick={() => console.log("crear cuenta...")}
            />
         </div>
      </div>
   )
}

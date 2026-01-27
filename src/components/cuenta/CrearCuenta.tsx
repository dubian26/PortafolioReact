import { Button } from "primereact/button"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { useContext, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { userRepository } from "../../db/repositories/UserRepository"
import { type UsuarioModel } from "../../models/UsuarioModel"

export const CrearCuenta = () => {
    const appCtx = useContext(AppContext)
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleClickRegistrar = async () => {
        // Validaciones básicas
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

        setLoading(true)
        try {
            // Verificar si el correo ya existe
            const existe = await userRepository.buscarPorEmail(email)
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

            await userRepository.agregar(nuevoUsuario)
            appCtx.mostrarExito("Usuario creado exitosamente")

            // Limpiar campos
            setNombre("")
            setEmail("")
            setPassword("")
        } catch (error) {
            appCtx.mostrarError("Ocurrió un error al intentar registrar el usuario")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-2">
            <IconField iconPosition="left">
                <InputIcon className="fa-solid fa-user" />
                <InputText
                    placeholder="Nombre completo" value={nombre}
                    disabled={loading} className="w-full"
                    onChange={(e) => setNombre(e.target.value)}
                />
            </IconField>

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
                <Password
                    placeholder="Password" value={password}
                    disabled={loading} className="w-full"
                    onChange={(e) => setPassword(e.target.value)}
                    feedback={true}
                    toggleMask
                    promptLabel="Elija una clave"
                    weakLabel="Débil"
                    mediumLabel="Media"
                    strongLabel="Fuerte"
                />
            </IconField>

            <Button
                label="Registrarme" icon="pi pi-user-plus"
                loading={loading} className="w-full mt-2"
                onClick={handleClickRegistrar}
            />
        </div>
    )
}

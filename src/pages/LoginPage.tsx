import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Fragment, useState } from "react"
import bgEscamas from "../assets/bg-escamas.png"
import bgTechBlue from "../assets/bg-tech-blue.png"
import { LoginForm } from "../components/login/LoginForm"
import { ContenidoPage } from "./ContenidoPage"

export const LoginPage = () => {
   const [visible, setVisible] = useState(false)

   return (
      <Fragment>
         <div className="absolute top-4 right-4 z-50">
            <Button
               icon="fa-solid fa-question" rounded={true}
               text={true} raised={true} aria-label="Ayuda"
               onClick={() => setVisible(true)}
            />
            <Dialog
               visible={visible} modal={true}
               className="w-11/12 lg:w-3/4"
               onHide={() => setVisible(false)}>
               <ContenidoPage />
            </Dialog>
         </div>
         <div className="flex min-h-screen">
            <div
               style={{ backgroundImage: `url(${bgTechBlue})` }}
               className="
               hidden md:block md:w-[30%] lg:w-[40%] 
               h-screen bg-cover bg-center bg-no-repeat"
            />
            <div className="grow h-screen">
               <div
                  style={{ backgroundImage: `url(${bgEscamas})` }}
                  className="
                  w-full min-h-screen flex flex-col items-center 
                  justify-center md:items-start bg-no-repeat 
                  bg-auto md:bg-contain px-5 sm:px-[20%] py-[10%]"
               >
                  <LoginForm />
               </div>
            </div>
         </div>
      </Fragment >
   )
}

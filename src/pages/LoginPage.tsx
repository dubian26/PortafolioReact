import bgEscamas from "../assets/bg-escamas.png"
import bgUnderwater from "../assets/bg-underwater.png"
import { LoginForm } from "../components/login/LoginForm"

export const LoginPage = () => {
   return (
      <div className="flex min-h-screen">
         <div
            style={{ backgroundImage: `url(${bgUnderwater})` }}
            className="
               hidden md:block md:w-[40%] lg:w-[50%] 
               h-screen bg-cover bg-center bg-no-repeat"
         />
         <div className="grow h-screen">
            <div
               style={{ backgroundImage: `url(${bgEscamas})` }}
               className="
                  w-full min-h-screen flex flex-col items-center 
                  justify-center md:items-start bg-no-repeat 
                  bg-auto md:bg-contain px-[20%] py-[10%]"
            >
               <LoginForm />
            </div>
         </div>
      </div>
   )
}

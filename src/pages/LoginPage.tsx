import { LoginForm } from "../components/login/LoginForm"

export const LoginPage = () => {
   return (
      <div className="flex min-h-screen">
         <div
            className="hidden md:block md:w-[40%] lg:w-[55%] h-screen 
            bg-[url(/src/assets/bg-underwater.png)] bg-cover bg-center bg-no-repeat"
         />
         <div className="grow h-screen">
            <div className="login-form">
               <LoginForm />
            </div>
         </div>
      </div>
   )
}

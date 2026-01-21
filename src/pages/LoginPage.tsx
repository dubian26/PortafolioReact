import { LoginForm } from "../components/login/LoginForm"

export const LoginPage = () => {
   return (
      <div className="flex min-h-screen">
         <div
            className="w-md min-w-[240px] hidden md:block h-screen 
            bg-[url(/src/assets/bg-coral.png)] bg-no-repeat"
         />
         <div className="grow h-screen">
            <div className="login-form">
               <LoginForm />
            </div>
         </div>
      </div>
   )
}

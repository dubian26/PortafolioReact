import { MoveDirection, OutMode, type Engine, type ISourceOptions } from "@tsparticles/engine"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Fragment, useEffect, useMemo, useState } from "react"
import bgTechBlue from "../assets/bg-tech-blue.png"
import { LoginForm } from "../components/login/LoginForm"
import { ContenidoPage } from "./ContenidoPage"

export const LoginPage = () => {
   const [visible, setVisible] = useState(false)

   const [init, setInit] = useState(false)

   useEffect(() => {
      initParticlesEngine(async (engine: Engine) => {
         await loadSlim(engine)
      }).then(() => {
         setInit(true)
      })
   }, [])

   const particlesOptions: ISourceOptions = useMemo(
      () => ({
         fullScreen: {
            enable: false,
            zIndex: 0
         },
         fpsLimit: 60,
         interactivity: {
            events: {
               onClick: {
                  enable: true,
                  mode: "push",
               },
               onHover: {
                  enable: true,
                  mode: "repulse",
               },
            },
            modes: {
               push: {
                  quantity: 4,
               },
               repulse: {
                  distance: 80,
                  duration: 0.4,
               },
            },
         },
         particles: {
            color: {
               value: "#60a5fa",
            },
            links: {
               color: "#ffffff",
               distance: 150,
               enable: false,
               opacity: 0.5,
               width: 1,
            },
            move: {
               direction: MoveDirection.top,
               enable: true,
               outModes: {
                  default: OutMode.out,
               },
               random: true,
               speed: 0.6,
               straight: false,
            },
            number: {
               density: {
                  enable: true,
                  area: 800,
               },
               value: 600,
            },
            opacity: {
               value: { min: 0.1, max: 1 },
               animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
               },
            },
            shape: {
               type: "square",
            },
            size: {
               value: { min: 1, max: 3 },
            },
         },
         detectRetina: true,
      }),
      [],
   )

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
            <div className="grow h-screen relative">
               <div
                  className="
                  w-full min-h-screen flex flex-col items-center 
                  justify-center md:items-start 
                  px-5 sm:px-[20%] py-[10%] relative"
               >
                  {
                     init && (
                        <Particles
                           id="tsparticles"
                           className="absolute inset-0 z-0"
                           options={particlesOptions}
                        />
                     )
                  }
                  <div className="relative z-10 w-full">
                     <LoginForm />
                  </div>
               </div>
            </div>
         </div>
      </Fragment >
   )
}

import { Dialog } from "primereact/dialog"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { convert } from "../../appconfig/Convert"

type Props = {
   onTimeout: () => void
   avisarCuandoQuede: string
   timeout: string
}

export const SessionTimeout = ({ onTimeout, avisarCuandoQuede, timeout }: Props) => {
   const ultimaActividadRef = useRef(0)
   const [mostrarAviso, setMostrarAviso] = useState(false)

   const timeoutSeg = convert.toSeconds(timeout)
   const avisarCuandoQuedeSeg = convert.toSeconds(avisarCuandoQuede)
   const [tiempoQueda, setTiempoQueda] = useState(timeoutSeg)

   const restablecer = useCallback(() => {
      ultimaActividadRef.current = Date.now()
      setMostrarAviso(false)
   }, [])

   useEffect(() => {
      ultimaActividadRef.current = Date.now()
      const events = ["mousemove", "keydown", "click", "scroll"]

      for (const event of events) {
         window.addEventListener(event, restablecer)
      }

      return () => {
         for (const event of events) {
            window.removeEventListener(event, restablecer)
         }
      }
   }, [restablecer])

   const formatoTiempo = useCallback((segundos: number) => {
      const mins = Math.floor(segundos / 60)
      const secs = segundos % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
   }, [])

   const handleEvalTiempoTranscur = useCallback(() => {
      const now = Date.now()
      const transcurrido = Math.floor((now - ultimaActividadRef.current) / 1000)
      const tiempoQuedaSeg = timeoutSeg - transcurrido

      setTiempoQueda(tiempoQuedaSeg)

      if (tiempoQuedaSeg <= avisarCuandoQuedeSeg)
         setMostrarAviso(true)

      if (tiempoQuedaSeg <= 0)
         onTimeout()

   }, [onTimeout, timeoutSeg, avisarCuandoQuedeSeg])

   useEffect(() => {
      const interval = setInterval(handleEvalTiempoTranscur, 1000)
      return () => clearInterval(interval)
   }, [handleEvalTiempoTranscur])

   const tiempoFormateado = useMemo(() =>
      formatoTiempo(Math.max(0, tiempoQueda)), [formatoTiempo, tiempoQueda])

   return (
      <Dialog
         header="Aviso de Inactividad" visible={mostrarAviso}
         style={{ width: "400px" }} onHide={() => { }} closable={false}
      >
         <span>Su sesión expirará en </span>
         <strong>{tiempoFormateado} </strong>
         <span>minutos debido a inactividad.</span>
      </Dialog>
   )
}

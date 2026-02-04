class DateUtility {
   formatFecha(valor: string) {
      if (!valor) return "-"
      const fecha = new Date(valor)
      return fecha.toLocaleDateString("es-CO", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit"
      })
   }
}

export const dateUtility = new DateUtility()

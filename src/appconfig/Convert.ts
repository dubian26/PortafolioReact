
/** clase trasversal con utilidades de conversion. **/
class Convert {
   toSeconds(tiempo: string): number {
      const regex = /^(\d+)([smhd])$/
      const match = tiempo.match(regex)
      if (!match) return 0
      const valor = parseInt(match[1])
      const unidad = match[2]
      switch (unidad) {
         case "s": return valor
         case "m": return valor * 60
         case "h": return valor * 60 * 60
         case "d": return valor * 60 * 60 * 24
         default: return 0
      }
   }
}

export const convert = new Convert()
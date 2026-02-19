import { type ErrorModel } from "../models/ErrorModel"
import { CustomError } from "./CustomError"

export class FetchUtility {

   static setParams(params: unknown, method: string = "POST"): RequestInit {
      const defaultHeaders = {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${sessionStorage.accessToken}`
      }

      return {
         method: method,
         headers: defaultHeaders,
         body: JSON.stringify(params)
      }
   }

   static async getData<T>(response: Response, callerName: string = ""): Promise<T | undefined> {
      if (response.status === 501) {
         const errorModel: ErrorModel = await response.json()
         throw CustomError.fromModel(errorModel)
      }

      if (!response.ok) {
         const callerNamex = callerName ? callerName : this.getCallerName()
         throw CustomError.fromFetch(callerNamex)
      }

      if (response.status === 204) return undefined
      const text = await response.text()
      if (!text || text === "null") return undefined
      return JSON.parse(text) as T
   }

   private static getCallerName = () => {
      const stack = new Error().stack
      // El stack es un string. La primera línea es el Error, 
      // la segunda es esta función, y la tercera es quien la llamó.
      const callerLine = stack?.split("\n")[2]
      const callerName = callerLine?.trim().split(" ")[1]
      return callerName ?? ""
   }
}

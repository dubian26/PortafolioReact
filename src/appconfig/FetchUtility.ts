import { type ErrorModel } from "../models/ErrorModel"
import { CustomError } from "./CustomError"

export class FetchUtility {

   static preRequest(params: unknown, method: string = "POST"): RequestInit {
      const defaultHeaders = {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${sessionStorage.tokenApi}`
      }

      return {
         method: method,
         headers: defaultHeaders,
         body: JSON.stringify(params)
      }
   }

   static async postRequest(response: Response, fetchName: string = "Login") {
      if (response.status === 501) {
         const errorModel: ErrorModel = await response.json()
         throw CustomError.fromModel(errorModel)
      }

      if (!response.ok) {
         throw CustomError.fromFetch(fetchName)
      }
   }
}

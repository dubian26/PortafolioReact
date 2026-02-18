import { type ErrorModel } from "../models/ErrorModel"
import { CustomError } from "./CustomError"

export class FetchUtility {

   static preRequest(params: unknown, method: string = "POST"): RequestInit {
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

   static async postRequest(response: Response, fetchName: string = "Login") {
      if (response.status === 501) {
         const errorModel: ErrorModel = await response.json()
         throw CustomError.fromModel(errorModel)
      }

      if (!response.ok) {
         throw CustomError.fromFetch(fetchName)
      }
   }

   static async getResponseData<T>(response: Response): Promise<T | undefined> {
      if (response.status === 204) return undefined
      const text = await response.text()
      if (!text || text === "null") return undefined
      return JSON.parse(text) as T
   }
}

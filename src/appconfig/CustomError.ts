import { type ErrorModel } from "../models/ErrorModel"

export class CustomError extends Error {
   errorModel: ErrorModel

   constructor(message: string) {
      super(message)
      this.name = "CustomError"
      this.errorModel = {
         type: "Custom",
         code: "ExBundle",
         message: message,
         traceId: "",
         details: []
      }
   }

   static fromModel(error: ErrorModel): CustomError {
      const customError = new CustomError(error.message)
      customError.errorModel = error
      return customError
   }

   static fromFetch(nombre: string): CustomError {
      const message = `Error consultando el recurso ${nombre}`
      const customError = new CustomError(message)
      customError.errorModel = {
         type: "Custom",
         code: "ExBundle",
         message: message,
         traceId: "",
         details: []
      }

      return customError
   }
}

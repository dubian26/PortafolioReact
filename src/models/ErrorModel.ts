export interface ErrorDetail {
   property: string
   message: string
}

export interface ErrorModel {
   type: string
   code: string
   message: string
   traceId: string
   details: ErrorDetail[]
}

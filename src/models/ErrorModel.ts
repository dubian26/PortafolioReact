export type ErrorDetail = {
   property: string
   message: string
}

export type ErrorModel = {
   type: string
   code: string
   message: string
   traceId: string
   details: ErrorDetail[]
}

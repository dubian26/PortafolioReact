import { API_URL, MOCK_DELAY } from "../appconfig/Constants"
import { CustomError } from "../appconfig/CustomError"
import { FetchUtility } from "../appconfig/FetchUtility"
import tokenApi from "../mocks/tokenApi.txt?raw"

type FetchParams = {
   email: string
   password: string
}

export const fetchLogin = async (params: FetchParams) => {
   if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, MOCK_DELAY))
      if (params.password === "ABC12345") throw new Error("Error no controlado")
      if (params.password === "12345ABC") throw new CustomError("Autenticación fallida")
      return tokenApi
   }
   else {
      const url = `${API_URL}/v1/login`
      const options = FetchUtility.preRequest(params)
      const response = await fetch(url, options)
      await FetchUtility.postRequest(response, "Login")
      const data = await response.text()
      return data
   }
}

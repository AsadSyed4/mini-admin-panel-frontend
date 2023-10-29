import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useUserSession } from './userSession'

let api: AxiosInstance

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  })

  // We set an interceptor for each request to
  // include Bearer token to the request if the user is logged in
  api.interceptors.request.use((config) => {
    const userSession = useUserSession()

    if (userSession.isLoggedIn) {
      // Create a new headers object from config.headers and add the Authorization header
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${userSession.user.token}`,
      }
    }

    return config
  })

  return api
}

export function useApi() {
  api = createApi()
  return api
}

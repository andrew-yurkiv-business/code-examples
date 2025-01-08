import axios from 'axios'
import { AxiosInstance } from 'axios/index'
import { useCookies } from '@vueuse/integrations/useCookies'
import { errorHandling } from '~/helpers/error-handling'
import { type AxiosResponse } from 'axios'
import type {
  ExtendedAxiosResponse,
  ExtendedAxiosError,
  ExtendedAxiosRequestConfig
} from '~/types/AxiosTypes'

export default defineNuxtPlugin((app) => {
  const config = useRuntimeConfig()
  const cookies = useCookies(['TOKEN'])

  const axiosPlugin: AxiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + cookies.get('TOKEN')
    }
  })

  axiosPlugin.interceptors.response.use(
    function (response: ExtendedAxiosResponse) {
      const $successToast: Function = app.$successToast as Function
      const {
        config: { autoToastOnSuccess = false, successMessage = null }
      } = response
      // Allows to automatically show a success notification in case if a request has succeeded
      if (autoToastOnSuccess && successMessage) {
        $successToast(successMessage)
      }

      return response
    },
    function (error: ExtendedAxiosError) {
      const $errorToast: Function = app.$errorToast as Function
      const {
        config: { autoToastOnError = true, errorMessage = null },
        response
      } = error
      const data = response?.data as { message: string; errors: Array<string> }
      const serverErrorMessage = errorHandling(data.errors)

      // Allows to automatically show an error notification in case if a request has failed
      if (autoToastOnError) {
        $errorToast(errorMessage || serverErrorMessage || data.message)
      }

      return Promise.reject({
        ...error,
        serverErrorMessage,
        serverErrors: data.errors
      } as ExtendedAxiosError)
    }
  )

  return {
    provide: {
      axios: axiosPlugin,
      makeAPIcall: (config?: ExtendedAxiosRequestConfig) => {
        const isLoading = ref(false)
        const responseData = ref({})

        return {
          isLoading,
          responseData,
          request: (requestConfig?: ExtendedAxiosRequestConfig) => {
            isLoading.value = true

            return axiosPlugin(requestConfig || config)
              .then((res: AxiosResponse) => {
                responseData.value = res.data?.data

                return res
              })
              .finally(() => {
                isLoading.value = false
              })
          }
        }
      }
    }
  }
})

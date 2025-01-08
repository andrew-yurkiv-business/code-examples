export const useBaseFetch = <DataType>(url: string, options?: object) => {
  const token = useCookie('TOKEN')
  const config = useRuntimeConfig()

  type GenericResponse = {
    data: DataType
    status: number
    message: string
  }

  return useFetch<GenericResponse>(url, {
    baseURL: config.public.apiBaseUrl,
    headers: {
      Authorization: 'Bearer ' + token.value
    },
    ...(options || {})
  })
}

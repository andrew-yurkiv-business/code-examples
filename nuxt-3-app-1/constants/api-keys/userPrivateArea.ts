// Represents a list of unique API-method's keys, which are about to be used in useFetch and useAsyncData
const KEYS = [
  'USER_PRIVATE_AREA_ME',
  'USER_PRIVATE_AREA_NOTIFICATIONS',
  'USER_PRIVATE_AREA_HELP_AND_SUPPORT',
  'USER_PRIVATE_AREA_MY_MESSAGES',
  'USER_PRIVATE_AREA_MY_DISCOUNTS',
  'USER_PRIVATE_AREA_MY_ORDERS'
] as const
type API_KEYS_TYPE = {
  [key in (typeof KEYS)[number]]: string
}

export const USER_PRIVATE_AREA_API_KEYS = Array.from(KEYS).reduce((acc, item) => {
  Object.defineProperty(acc, item, {
    value: item
  })

  return acc
}, {}) as API_KEYS_TYPE

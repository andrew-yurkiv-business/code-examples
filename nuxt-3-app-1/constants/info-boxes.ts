// Represents a list of unique info boxes ID's
const KEYS = [
  'USER_PRIVATE_AREA_MY_ORDERS_FILTERS_INSTRUCTION_ALERT',
  'USER_PRIVATE_AREA_INDIVIDUAL_ORDER_SUCCESSFULLY_PAID_ALERT'
] as const
type INFO_BOXES_IDS_TYPE = {
  [key in (typeof KEYS)[number]]: string
}

export const INFO_BOXES_IDS = Array.from(KEYS).reduce((acc, item) => {
  Object.defineProperty(acc, item, {
    value: item
  })

  return acc
}, {}) as INFO_BOXES_IDS_TYPE

export type INFO_BOX_ID_TYPE = INFO_BOXES_IDS_TYPE[keyof INFO_BOXES_IDS_TYPE]

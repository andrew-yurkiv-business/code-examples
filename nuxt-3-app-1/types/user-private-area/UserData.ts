import { type INFO_BOX_ID_TYPE } from '~/constants'

export type UserPrivateAreaUserDataType = {
  id: number
  email: string
  name: string
  phone_number?: string
  referral_code?: string
  referred_by?: string
  timezone?: string
}

export type UserSessionDataType = {
  infoBoxesToHide: Set<INFO_BOX_ID_TYPE>
}

import type { RouteLocationRaw } from 'vue-router'
import { type Content } from 'vue3-toastify'

export type StatusToastType = 'success' | 'error' | 'warning'
export type StatusToastDataType = {
  text: Content
}

export type NotificationToastDataType = {
  data?: any
  redirectTo: RouteLocationRaw
  title?: string
}

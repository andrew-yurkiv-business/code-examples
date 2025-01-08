import { useAuthStore } from '~/stores/modules/auth'
const authStore = useAuthStore()

export default defineNuxtRouteMiddleware(() => {
  if (!process.server && !authStore.TOKEN) {
    return navigateTo({ name: 'auth-login' })
  }
})

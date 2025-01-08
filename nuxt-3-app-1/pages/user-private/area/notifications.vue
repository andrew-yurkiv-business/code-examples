<template>
  <div class="notifications-page">
    <user-private-area-notifications-index-component />
  </div>
</template>

<script setup lang="ts">
import { USER_PRIVATE_AREA_API_KEYS } from '~/constants/api-keys'
import { useUserPrivateAreaNotificationsStore } from '~/stores/user-private-area/notifications'

definePageMeta({
  layout: 'user-private-area',
  middleware: '01-user-private-area'
})

const notificationsStore = useUserPrivateAreaNotificationsStore()

try {
  const response = await useBaseFetch('/user/me', {
    key: USER_PRIVATE_AREA_API_KEYS.USER_PRIVATE_AREA_NOTIFICATIONS
  })

  // TODO: add the proper error handling functionality once the back-end would be finalized
  notificationsStore.notificationsList = [
    // A place for hardcoded data
  ]
} catch (err) {
  // TODO: add the proper error handling functionality once the back-end would be finalized
  console.log('🚀 → err:', err)
}
</script>

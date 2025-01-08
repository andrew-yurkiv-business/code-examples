import { defineStore } from 'pinia'
import type { NotificationType } from '~/types/user-private-area/Notification'
import { PrivateSocket } from '~/utils/sockets'
import { useUserPrivateAreaStore } from '~/stores/user-private-area'
import { UserPrivateAreaNotificationsToast } from '#components'

export const useUserPrivateAreaNotificationsStore = defineStore(
  'UserPrivateAreaNotificationsStore',
  () => {
    const { $makeAPIcall } = useNuxtApp()

    const userPrivateAreaStore = useUserPrivateAreaStore()
    const notificationsList: Ref<Array<NotificationType>> = ref([])

    const isListEmpty = computed(() => notificationsList.value.length === 0)

    const initMarkingNotificationAsRead = $makeAPIcall()
    const initMarkingAllNotificationsAsRead = $makeAPIcall()
    const initDeletingAllNotifications = $makeAPIcall()
    const initDeletingNotification = $makeAPIcall()

    const markNotificationAsRead = async ({ notificationId }: { notificationId: string }) => {
      await initMarkingNotificationAsRead.request({
        method: 'patch',
        url: `/user/notifications/mark-as-read/${notificationId}`,
        autoToastOnSuccess: false
      })

      const notificationIndex = notificationsList.value.findIndex(
        (notification) => notification.id === notificationId
      )
      if (notificationIndex !== -1) {
        notificationsList.value.splice(notificationIndex, 1, {
          ...notificationsList.value[notificationIndex],
          is_read: true
        })
      }

      return initMarkingNotificationAsRead
    }

    const markAllNotificationsAsRead = async () => {
      await initMarkingNotificationAsRead.request({
        method: 'patch',
        url: '/user/notifications/mark-all-as-read',
        autoToastOnSuccess: false
      })

      notificationsList.value = notificationsList.value.map((notification) => ({
        ...notification,
        is_read: true
      }))

      return initMarkingNotificationAsRead
    }

    const deleteAllNotifications = async () => {
      await initDeletingAllNotifications.request({
        method: 'delete',
        url: '/user/notifications',
        autoToastOnSuccess: true,
        successMessage: 'Notifications have been deleted'
      })

      notificationsList.value = []

      return initDeletingAllNotifications
    }

    const deleteNotification = async ({
      notificationId
    }: {
      notificationId: NotificationType['id']
    }) => {
      await initDeletingNotification.request({
        method: 'delete',
        url: `/user/notifications/${notificationId}`,
        autoToastOnSuccess: true,
        successMessage: 'Notification has been deleted'
      })

      notificationsList.value = notificationsList.value.filter(
        (notification) => notification.id !== notificationId
      )

      return initDeletingNotification
    }

    const enableSocket = () => {
      const socket = new PrivateSocket(`notifications.${userPrivateAreaStore.serverData.id}`)
      const { displayToast } = useNotificationToast()
      socket.listen('.notification', (res: NotificationType) => {
        displayToast('regular-notification-toast', UserPrivateAreaNotificationsToast, {
          data: { notification: res }
        })
      })
    }

    return {
      notificationsList,
      isListEmpty,
      initMarkingNotificationAsRead,
      markNotificationAsRead,
      initMarkingAllNotificationsAsRead,
      markAllNotificationsAsRead,
      initDeletingAllNotifications,
      deleteAllNotifications,
      initDeletingNotification,
      deleteNotification,
      enableSocket
    }
  }
)

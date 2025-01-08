<template>
  <section
    :class="[
      'notifications-page-content',
      {
        'section-is-loading':
          isDeletingAllNotificationsInProgress || isDeletingNotificationInProgress
      }
    ]"
  >
    <user-private-area-notifications-no-items-view v-if="notificationsStore.isListEmpty" />
    <div v-else class="white-card__plain page-card">
      <div class="heading-row">
        <h3 class="white-card__heading">Page heading</h3>
        <client-only>
          <button class="mark-as-read-button" @click="onMarkAllAsReadClick">
            <IconsTwoCheckMarksOverlap class="mark-as-read-icon" />
            <span class="button-text">Mark notifications as read button</span>
          </button>
        </client-only>
      </div>
      <div class="white-card__hr"></div>
      <user-private-area-notifications-notification-cards-list
        :notifications-list="notificationsStore.notificationsList"
        class="notification-cards-list"
      />
      <div class="delete-all-button-row">
        <v-btn
          prepend-icon="mdi-trash-can"
          variant="flat"
          class="text-none delete-all-button"
          @click="onDeleteAllClick"
        >
          Delete all notifications button
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserPrivateAreaNotificationsStore } from '~/stores/user-private-area/notifications'
import { LazyUserPrivateAreaNotificationsConfirmDeletingAllNotificationsDialogContent } from '#components'

const { $openDialog } = useNuxtApp()

const notificationsStore = useUserPrivateAreaNotificationsStore()

const { isLoading: isDeletingAllNotificationsInProgress } = toRefs(
  notificationsStore.initDeletingAllNotifications
)
const { isLoading: isDeletingNotificationInProgress } = toRefs(
  notificationsStore.initDeletingNotification
)

const onMarkAllAsReadClick = () => {
  notificationsStore.markAllNotificationsAsRead()
}

const onDeleteAllClick = () => {
  const { addEventListener, removeEventListener } = $openDialog(
    'confirm-deleting-all-notifications-dialog',
    {
      component: markRaw(LazyUserPrivateAreaNotificationsConfirmDeletingAllNotificationsDialogContent)
    }
  )
  addEventListener('delete-confirm', () => {
    deleteAllNotifications()
    removeEventListener('delete-confirm')
  })
}

const deleteAllNotifications = () => {
  notificationsStore.deleteAllNotifications()
}
</script>

<style lang="scss" scoped src="~/assets/scss/user-private-area.scss"></style>
<style lang="scss" scoped>
.notifications-page-content {
  width: 100%;
  height: 100%;
}

.page-card {
  border-radius: 12px;

  @include laptop {
    padding: 27px 0 24px;
  }

  @include tablet {
    padding: 32px 0 24px;
  }

  @include mobile {
    padding: 29px 0 24px;
  }
}

.heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @include laptop {
    padding: 0 40px;
  }

  @include mobileAndTablet {
    padding: 0 16px;
  }
}

.mark-as-read-button {
  --color: #{$text-gray};
  --hover-color: #{$primary-blue-500};

  position: relative;
  right: -5px;
  display: flex;
  align-items: center;
  padding: 5px;

  &.all-read {
    &:hover {
      --color: var(--hover-color);
    }
  }

  &:not(.all-read) {
    &:not(:hover) {
      --color: #{$text-blue};
    }

    &:hover {
      --color: var(--hover-color);
    }
  }

  .mark-as-read-icon {
    fill: var(--color);
  }

  .button-text {
    margin-left: 10px;
    color: var(--color);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.5;
    transition: color $animation-duration-1;
  }
}

.notification-cards-list {
  @include tablet {
    margin-bottom: 16px;
  }
}

.delete-all-button-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @include laptop {
    margin-top: 13px;
  }

  @include tablet {
    margin-top: auto;
  }
}

.delete-all-button {
  font-weight: 500;
  line-height: 1;
  color: $error-red-500;
  letter-spacing: normal;
  border-radius: 32px;

  @include laptop {
    font-size: 14px;
  }

  @include tablet {
    font-size: 16px;
  }

  &:focus {
    border: 1px solid $error-red-200;
  }
}
</style>

import type { DialogPayloadType } from '~/types/Dialog'
import { getDialogActionEventName } from '~/composables/useDialogContentComponent'

export default defineNuxtPlugin((app) => {
  const $emitGlobalEvent: Function = app.$emitGlobalEvent as Function
  const $addGlobalEventListener: Function = app.$addGlobalEventListener as Function
  const $removeGlobalEventListener: Function = app.$removeGlobalEventListener as Function
  const defaultDialogConfig = {
    preBuiltLayout: 'card',
    closeButton: true
  }
  // A list of dialog-specific event listeners
  const dialogRegisteredEvents = new Set<string>()
  const removeDialogRegisteredEventListeners = (dialogId: DialogPayloadType['dialogId']) => {
    dialogRegisteredEvents.forEach((event) => {
      if (event.startsWith(`dialog-${dialogId}`)) {
        $removeGlobalEventListener(event)
        dialogRegisteredEvents.delete(event)
      }
    })
  }

  return {
    provide: {
      openDialog: (dialogId: DialogPayloadType['dialogId'], payload: any) => {
        const defaultComponentOptions = {
          dialogId
        }
        // Open the modal
        $emitGlobalEvent('dialog:open', {
          dialogId,
          ...defaultDialogConfig,
          ...payload,
          componentOptions: {
            ...defaultComponentOptions,
            ...(payload?.componentOptions || {})
          }
        } as DialogPayloadType)

        const dialogClosedEventName = `dialog-${dialogId}:closed`

        // Remove all the related event listeners after the dialog has been closed
        $addGlobalEventListener(dialogClosedEventName, () => {
          removeDialogRegisteredEventListeners(dialogId)
          $removeGlobalEventListener(dialogClosedEventName)
        })

        return {
          // An API for listening the dialog-specific events
          addEventListener: (eventName: string, handler: Function) => {
            const encapsulatedEventName = getDialogActionEventName(dialogId, eventName)

            dialogRegisteredEvents.add(encapsulatedEventName)
            $addGlobalEventListener(encapsulatedEventName, handler)
          },
          // An API for removing the listeners of the dialog-specific events
          removeEventListener: (eventName: string, handler?: Function) => {
            const encapsulatedEventName = getDialogActionEventName(dialogId, eventName)

            $removeGlobalEventListener(encapsulatedEventName, handler)
            dialogRegisteredEvents.delete(encapsulatedEventName)
          }
        }
      },
      closeDialog: (dialogId: DialogPayloadType['dialogId']) => {
        $emitGlobalEvent('dialog:close', { dialogId })
        removeDialogRegisteredEventListeners(dialogId)
      }
    }
  }
})

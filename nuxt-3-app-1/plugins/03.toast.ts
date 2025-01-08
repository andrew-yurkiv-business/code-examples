// https://github.com/jerrywu001/vue3-toastify
import Vue3Toastify, { toast, type Content, type ToastOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { StatusToastDataType, StatusToastType } from '~/types/user-private-area/Toast'
import { UserPrivateAreaToastStatus } from '#components'

type OmitTypeToastOption = Omit<ToastOptions, 'type' | 'disabledEnterTransition'>

export default defineNuxtPlugin((app) => {
  app.vueApp.use(Vue3Toastify)

  return {
    provide: {
      toast,
      ...(() => {
        const getConfigFunction =
          (type: StatusToastType) => (content: Content, options?: OmitTypeToastOption) =>
            toast[type](UserPrivateAreaToastStatus, {
              transition: {
                enter: 'toast-enter',
                exit: 'toast-exit'
              },
              position: 'bottom-center',
              toastClassName: `${type}-toast`,
              hideProgressBar: true,
              icon: false,
              closeButton: false,
              data: {
                text: content
              } as StatusToastDataType,
              ...(options || {})
            })

        return {
          successToast: getConfigFunction('success'),
          errorToast: getConfigFunction('error'),
          warningToast: getConfigFunction('warning')
        }
      })()
    }
  }
})

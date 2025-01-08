import { defineStore } from 'pinia'
import type {
  UserPrivateAreaUserDataType,
  UserSessionDataType
} from '~/types/user-private-area/UserData'
import { destr } from 'destr'

export const useUserPrivateAreaStore = defineStore(
  'UserPrivateAreaStore',
  () => {
    const sidebarState = ref(true)
    const serverData = ref({
      id: 0,
      email: '',
      name: ''
    } as UserPrivateAreaUserDataType)
    // A data which makes sense only during the active user session. This is about to be wiped after log out
    const sessionData: Ref<UserSessionDataType> = ref({
      infoBoxesToHide: new Set()
    })

    const setServerData = (data: object) => {
      serverData.value = data as UserPrivateAreaUserDataType
    }

    const toggleSidebar = () => (sidebarState.value = !sidebarState.value)

    const $reset = () => {
      sidebarState.value = true
      setServerData({
        id: 0,
        email: '',
        name: ''
      })
    }

    return {
      $reset,
      sidebarState,
      toggleSidebar,
      serverData,
      sessionData,
      setServerData
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      serializer: {
        serialize: (value) => {
          const data = {
            ...value,
            sessionData: {
              ...value.sessionData,
              infoBoxesToHide: Array.from(value.sessionData.infoBoxesToHide)
            }
          }

          return JSON.stringify(data)
        },
        deserialize: (value) => {
          const result = destr(value)
          result.sessionData.infoBoxesToHide = new Set(result.sessionData.infoBoxesToHide)

          return result
        }
      }
    }
  }
)

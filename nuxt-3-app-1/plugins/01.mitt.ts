// https://github.com/developit/mitt
import mitt from 'mitt'
import type { GlobalEventsType } from '~/types/GlobalEvents'

export default defineNuxtPlugin(() => {
  const emitter = mitt<GlobalEventsType>()

  return {
    provide: {
      emitGlobalEvent: emitter.emit,
      addGlobalEventListener: emitter.on,
      removeGlobalEventListener: emitter.off
    }
  }
})

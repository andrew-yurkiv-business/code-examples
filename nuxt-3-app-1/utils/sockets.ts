import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies(['TOKEN'])

const genericConfig = {
  broadcaster: 'reverb',
  key: import.meta.env.VITE_SOCKETS_GENERIC_CONFIG_KEY,
  wsHost: import.meta.env.VITE_SOCKETS_GENERIC_CONFIG_WS_HOST,
  wssPort: import.meta.env.VITE_SOCKETS_GENERIC_CONFIG_WSS_PORT,
  forceTLS: true,
  authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${cookies.get('TOKEN')}`
    }
  },
  enabledTransports: ['ws', 'wss']
}

// Laravel Echo: https://www.npmjs.com/package/laravel-echo
export const createSocket = async (config = genericConfig) => {
  // @ts-ignore
  if (!window.Pusher || !window.Echo) {
    const [{ default: Pusher }, { default: Echo }] = await Promise.all([
      import('pusher-js'),
      import('laravel-echo')
    ])

    // @ts-ignore
    window.Pusher = Pusher
    // @ts-ignore
    window.Echo = Echo
  }

  // @ts-ignore
  return new Echo(config)
}

export class PrivateSocket {
  socketName: string
  socket: any

  constructor(socketName: string) {
    this.socketName = socketName
  }

  async listen(eventName: string, onUpdate: Function) {
    const socket = await createSocket()
    this.socket = socket
    socket.private(this.socketName).listen(eventName, onUpdate)
  }

  leave() {
    this.socket.leave(this.socketName)
  }
}

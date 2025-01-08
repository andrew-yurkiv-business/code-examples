import type { DialogPayloadType } from '~/types/Dialog'

export type GlobalEventsType = {
  'dialog:open': DialogPayloadType
  'dialog:close': DialogPayloadType
  'window:resize': Event
}

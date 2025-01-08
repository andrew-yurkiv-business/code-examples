import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

import { es } from 'vuetify/locale'
import DateFnsAdapter from '@date-io/date-fns'
import enUS from 'date-fns/locale/en-US'
import dateES from 'date-fns/locale/es'
import { useLocale } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi'
    },
    components: {
      VNumberInput
    },
    locale: {
      messages: { es }
    },
    date: {
      adapter: DateFnsAdapter,
      locale: {
        en: enUS,
        es: dateES
      }
    }
    /*locale: {
            locale: 'es',
            fallback: 'es',
            messages: { es },
        },*/
  })
  app.vueApp.use(vuetify)

  //const { current } = useLocale()
  //current.value = 'es'
})

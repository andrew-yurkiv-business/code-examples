// https://nuxt.com/docs/api/configuration/nuxt-config
import { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL
    }
  },
  googleSignIn: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  },
  css: [
    '~/assets/scss/main.scss'
  ],
  build: {
    transpile: ['vuetify']
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-vue3-google-signin',
    '@pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '~/assets/scss/variables/_colors',
            '~/assets/scss/variables/_common',
            '~/assets/scss/variables/_responsiveness',
            '~/assets/scss/variables/_animations',
            '~/assets/scss/mixins/_media-queries',
            '~/assets/scss/mixins/_global-mixins'
          ]
            .map((scssFilePath) => `@use "${scssFilePath}" as *;`)
            .join('\n')
        }
      }
    }
  }
})

import tailwindcss from '@tailwindcss/vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  srcDir: 'app',

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Siemreap&display=swap' },
      ],
      htmlAttrs: { class: 'siemreap-regular' },
    },
  },

  // Static app
  ssr: false,

  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  // Auto-import components
  components: [
    { path: '~/components/', pathPrefix: false }
  ],


  // CSS order: Vuetify (components) → index (reset, font, global) → Tailwind (utilities, wins when both apply)
  css: [
    '~/assets/styles/vuetify.scss',
    '~/assets/styles/index.scss',
    '~/assets/styles/tailwind.css',
  ],

  build: {
    transpile: ['vuetify']
  },

  devServer: {
    host: 'localhost',
    port: 5173
  },

  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss(), vuetify({ autoImport: true })] as any,

    vue: {
      template: {
        transformAssetUrls
      }
    }
  },

  i18n: {
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      { code: 'en', file: 'en.ts', name: 'English' },
      { code: 'km', file: 'km.ts', name: 'Khmer' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'en'
    }
  }
})

/**
 * Declare Nuxt/i18n auto-imports that are not yet in .nuxt/types/imports.d.ts.
 * useI18n is provided by @nuxtjs/i18n (from vue-i18n) at runtime but missing from generated types.
 */
import type { useI18n as useI18nType } from 'vue-i18n'

declare global {
  const useI18n: typeof useI18nType
}

export {}

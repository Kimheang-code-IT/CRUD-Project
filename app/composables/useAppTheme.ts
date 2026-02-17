import { useTheme } from 'vuetify'

/**
 * Syncs AppStore theme (light/dark) to Vuetify's global theme so the whole app
 * (all pages under v-app) uses it. Call once from the default layout.
 */
export function useAppTheme(): void {
  const appStore = useAppStore()
  const theme = useTheme()

  onMounted(() => {
    theme.global.name.value = appStore.theme
  })

  watch(
    () => appStore.theme,
    (name) => {
      theme.global.name.value = name
    },
    { immediate: false }
  )
}

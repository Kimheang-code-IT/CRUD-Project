import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import type { IMenuState } from '~/types/app/IMenuState'
import type { INotifyState } from '~/types/app/INotifyState'
import type { ISystemState } from '~/types/app/ISystemState'
import { AppConfigService } from '~/services/AppConfigService'

export const useAppStore = defineStore('app', () => {
  const { locale } = useI18n()
  const { mdAndUp, smAndUp } = useDisplay()

  const dialogConfirm = ref(false)
  const dialogPayload = ref<{
    message?: string
    messageParams?: Record<string, number | string>
    type?: 'info' | 'delete'
  } | null>(null)
  let dialogResolve: ((value: boolean) => void) | null = null

  const menu = ref<IMenuState>({ drawer: true, rail: false })
  const menuRight = ref<{ drawer: boolean }>({ drawer: false })
  const chatbotFullMain = ref(false)

  const THEME_STORAGE_KEY = 'app_theme'
  const theme = ref<'light' | 'dark'>(
    (typeof localStorage !== 'undefined' ? (localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark') : null) || 'light'
  )
  const system = ref<ISystemState>({
    busy: false,
    firstLoad: true,
    download: false,
    downloadPercent: 0,
  })
  const notify = ref<INotifyState>({
    show: false,
    type: null,
    icon: null,
    text: null,
    timeout: 2000,
  })

  const isKhmer = computed(() => locale.value === 'km')
  const isMdAndUp = computed(() => mdAndUp.value)
  const isSmAndUp = computed(() => smAndUp.value)

  function setLocalConfig(): void {
    const uuid = AppConfigService.getUuid()
    if (!uuid) return
    AppConfigService.saveUserConfig(uuid, menu.value)
  }

  function loadUserConfig(): void {
    const uuid = AppConfigService.getUuid()
    if (!uuid) return
    const config = AppConfigService.loadUserConfig(uuid)
    if (config?.menu) {
      menu.value = { ...menu.value, ...config.menu }
    }
  }

  function handleError(error: unknown): void {
    console.log('error ====== ', error)
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status !== 401) notifyError()
  }

  function setDrawer(value: boolean): void {
    menu.value.drawer = value
  }

  function setRail(value: boolean): void {
    menu.value.rail = value
  }

  function toggleDrawer(): void {
    menu.value.drawer = !menu.value.drawer
  }

  function toggleDrawerRight(): void {
    menuRight.value.drawer = !menuRight.value.drawer
    if (!menuRight.value.drawer) chatbotFullMain.value = false
    setLocalConfig()
  }

  function setChatbotFullMain(value: boolean): void {
    chatbotFullMain.value = value
  }

  function toggleChatbotFullMain(): void {
    chatbotFullMain.value = !chatbotFullMain.value
  }

  function toggleRail(): void {
    menu.value.rail = !menu.value.rail
  }

  function setTheme(mode: 'light' | 'dark'): void {
    theme.value = mode
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }

  function toggleTheme(): void {
    const next = theme.value === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  function busy(bool = true): void {
    system.value.busy = bool
  }

  function closeFirstLoad(): void {
    if (system.value.firstLoad) system.value.firstLoad = false
  }

  function setDownload(bool = true): void {
    system.value.download = bool
  }

  function setDownloadPercent(percent = 0): void {
    system.value.downloadPercent = percent
  }

  function notifySuccess(text = 'common.notify.type.success'): void {
    notify.value = { ...notify.value, show: true, type: 'success', icon: '$success', text }
  }

  function notifyError(text = 'common.notify.type.error'): void {
    notify.value = { ...notify.value, show: true, type: 'error', icon: '$error', text }
  }

  function notifyWarning(text = 'common.notify.type.warning'): void {
    notify.value = { ...notify.value, show: true, type: 'warning', icon: '$warning', text }
  }

  function notifyInfo(text = 'common.notify.type.info'): void {
    notify.value = { ...notify.value, show: true, type: 'info', icon: '$info', text }
  }

  function closeNotify(): void {
    notify.value = { ...notify.value, show: false }
  }

  function dialogConfirmEvent(payload?: {
    message?: string
    messageParams?: Record<string, number | string>
    type?: 'info' | 'delete'
  }): Promise<boolean> {
    dialogPayload.value = payload ?? { message: 'Are you sure?', type: 'delete' }
    dialogConfirm.value = true
    return new Promise((resolve) => {
      dialogResolve = resolve
    })
  }

  function dialogConfirmClose(result: boolean): void {
    dialogConfirm.value = false
    if (dialogResolve) {
      dialogResolve(result)
      dialogResolve = null
    }
  }

  return {
    isMdAndUp,
    isSmAndUp,
    system,
    notify,
    menu,
    menuRight,
    chatbotFullMain,
    theme,
    isKhmer,
    dialogConfirm,
    dialogPayload,
    setDownload,
    setDownloadPercent,
    busy,
    notifySuccess,
    notifyError,
    handleError,
    notifyWarning,
    notifyInfo,
    closeNotify,
    toggleDrawer,
    toggleDrawerRight,
    setChatbotFullMain,
    toggleChatbotFullMain,
    toggleRail,
    closeFirstLoad,
    dialogConfirmEvent,
    dialogConfirmClose,
    setLocalConfig,
    loadUserConfig,
    setDrawer,
    setRail,
    setTheme,
    toggleTheme,
  }
})

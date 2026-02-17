<script lang="ts" setup>
/**
 * Global toast (snackbar) — top-right, driven by AppStore notify state.
 * Styled as callout: colored background, icon left, white text, close right.
 * Use appStore.notifySuccess(msg), notifyError(msg), etc. from any page.
 */
const appStore = useAppStore()
const notify = computed(() => appStore.notify)

const { t } = useI18n()
const displayText = computed(() => {
  const key = notify.value.text
  if (!key) return ''
  try {
    const translated = t(key)
    return typeof translated === 'string' && translated !== key ? translated : key
  } catch {
    return key
  }
})

const toastConfig = computed(() => {
  const type = notify.value.type
  switch (type) {
    case 'success':
      return {
        bg: 'bg-emerald-500',
        icon: 'mdi-check-circle',
        iconBg: 'bg-white/25 ring-2 ring-white/40',
      }
    case 'info':
      return {
        bg: 'bg-blue-500',
        icon: 'mdi-information',
        iconBg: 'bg-white/25 ring-2 ring-white/40',
      }
    case 'warning':
      return {
        bg: 'bg-amber-500',
        icon: 'mdi-alert',
        iconBg: 'bg-white/25 ring-2 ring-white/40',
      }
    case 'error':
      return {
        bg: 'bg-red-500',
        icon: 'mdi-alert-circle',
        iconBg: 'bg-white/25 ring-2 ring-white/40',
      }
    default:
      return {
        bg: 'bg-neutral-600',
        icon: 'mdi-information',
        iconBg: 'bg-white/25 ring-2 ring-white/40',
      }
  }
})

function onClose() {
  appStore.closeNotify()
}
</script>

<template>
  <v-snackbar
    :model-value="notify.show"
    :timeout="notify.timeout"
    location="top right"
    variant="flat"
    content-class="p-0 overflow-visible"
    class="app-toast-snackbar"
    @update:model-value="(v: boolean) => !v && onClose()"
  >
    <div
      :class="[toastConfig.bg]"
      class="flex min-w-0 items-center gap-3 rounded-sm px-4 py-3 shadow-sm"
    >
      <!-- Icon left: circle/triangle with white icon -->
      <div
        :class="toastConfig.iconBg"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      >
        <v-icon :icon="toastConfig.icon" size="22" class="text-white" />
      </div>
      <!-- Callout text -->
      <span class="min-w-0 flex-1 text-sm font-medium text-white">
        {{ displayText }}
      </span>
      <!-- Close -->
      <v-btn
        icon
        size="small"
        variant="text"
        class="shrink-0 text-white opacity-90 hover:opacity-100"
        aria-label="Close"
        @click="onClose"
      >
        <v-icon icon="mdi-close" size="20" />
      </v-btn>
    </div>
  </v-snackbar>
</template>

<style scoped>
/* Snackbar shows only our card; no extra background or padding */
.app-toast-snackbar :deep(.v-snackbar__wrapper) {
  padding: 0;
  min-width: 0;
  background: transparent;
  box-shadow: none;
}
.app-toast-snackbar :deep(.v-snackbar__content) {
  padding: 0;
  min-width: 0;
  max-width: 420px;
}
</style>

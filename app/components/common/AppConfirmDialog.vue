<script lang="ts" setup>
/**
 * Global confirm dialog — driven by AppStore dialogConfirm / dialogPayload.
 * All text uses i18n keys from common.dialog.confirm so every page can translate.
 */
const appStore = useAppStore()
const { t } = useI18n({ useScope: 'global' })

const visible = computed(() => appStore.dialogConfirm)
const payload = computed(() => appStore.dialogPayload ?? { message: 'common.dialog.confirm.descriptionDelete', type: 'info' })

const titleKey = computed(() =>
  payload.value.type === 'delete' ? 'common.dialog.confirm.titleDelete' : 'common.dialog.confirm.title'
)
const titleIcon = computed(() => (payload.value.type === 'delete' ? 'mdi-delete-outline' : 'mdi-information-outline'))
const messageParams = computed(() => (payload.value as { messageParams?: Record<string, number | string> })?.messageParams ?? {})
const confirmVariant = computed(() => (payload.value.type === 'delete' ? 'error' : 'primary'))
const confirmTextKey = computed(() =>
  payload.value.type === 'delete' ? 'common.dialog.confirm.buttonDelete' : 'common.dialog.confirm.buttonConfirm'
)

function onConfirm() {
  appStore.dialogConfirmClose(true)
}

function onCancel() {
  appStore.dialogConfirmClose(false)
}
</script>

<template>
  <AppDialog
    :model-value="visible"
    :title="t(titleKey)"
    :title-icon="titleIcon"
    :message="payload?.message ? t(payload.message, messageParams) : ''"
    :cancel-text="t('common.dialog.confirm.buttonCancel')"
    :confirm-text="t(confirmTextKey)"
    confirm-mode
    :confirm-variant="confirmVariant"
    max-width="400"
    content-class="min-w-[300px]"
    @update:model-value="(v: boolean) => !v && onCancel()"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

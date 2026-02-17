<script lang="ts" setup>
/**
 * Generic dialog for all pages: content dialogs and confirm-action dialogs.
 * - Default: custom content + optional actions slot.
 * - Confirm mode: message + Confirm/Cancel buttons, emits confirm and cancel.
 */
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    /** Optional icon shown before the title (e.g. mdi-information, mdi-delete) */
    titleIcon?: string
    /** Confirm-action mode: show message with Confirm/Cancel buttons */
    confirmMode?: boolean
    /** Message body (used when confirmMode is true) */
    message?: string
    confirmText?: string
    cancelText?: string
    /** Confirm button variant (e.g. 'error' for delete) */
    confirmVariant?: 'primary' | 'error' | 'default'
    maxWidth?: number | string
    persistent?: boolean
    /** Class applied to the dialog content panel (use this for Tailwind; root class goes on the teleport wrapper) */
    contentClass?: string
  }>(),
  {
    titleIcon: '',
    confirmMode: false,
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
    maxWidth: 560,
    persistent: true,
    contentClass: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
  close()
}

function onCancel() {
  emit('cancel')
  close()
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    :content-class="contentClass"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card
      class="overflow-hidden rounded-sm shadow-xl"
      :class="confirmMode ? 'border-0' : 'border border-neutral-200 dark:border-neutral-600'"
    >
      <div
        class="flex items-center justify-between gap-3 px-4 py-3"
        :class="confirmMode ? '' : 'border-b border-neutral-200 dark:border-neutral-600'"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <v-icon v-if="titleIcon" :icon="titleIcon" size="24" class="shrink-0 text-neutral-600 dark:text-neutral-400" />
          <span class="min-w-0 flex-1 text-lg font-semibold text-neutral-800 dark:text-neutral-100">{{ title }}</span>
        </div>
        <slot name="headerActions" />
      </div>
      <div class="p-4">
        <p v-if="confirmMode && message" class="text-neutral-700 dark:text-neutral-300">{{ message }}</p>
        <slot v-else />
      </div>
      <!-- Confirm mode: built-in Confirm/Cancel, no border -->
      <div v-if="confirmMode" class="flex justify-end gap-2 px-4 py-3">
        <v-btn class="rounded-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" variant="text" @click="onCancel">
          {{ cancelText }}
        </v-btn>
        <v-btn
          :class="
            confirmVariant === 'error'
              ? 'rounded-sm bg-red-600 text-white hover:opacity-90'
              : 'rounded-sm bg-[#2A5A7F] dark:bg-[#3d7ba8] text-white hover:opacity-90'
          "
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </div>
      <!-- Footer actions (when not confirm mode and actions slot provided and no headerActions) -->
      <div
        v-else-if="$slots.actions && !$slots.headerActions"
        class="flex justify-end gap-2 border-t border-neutral-200 dark:border-neutral-600 px-4 py-3"
      >
        <slot name="actions" :close="close" />
      </div>
    </v-card>
  </v-dialog>
</template>

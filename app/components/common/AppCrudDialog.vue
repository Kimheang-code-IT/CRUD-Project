<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    /** Entity name shown in title, e.g. "Total Trade", "SITC" */
    entityName: string
    /** true = "Edit {entityName}", false = "Add {entityName}" */
    isEdit?: boolean
    /** Show Delete button (e.g. in edit mode) */
    showDelete?: boolean
    maxWidth?: number | string
    /** Disable Save button (e.g. when form invalid) */
    saveDisabled?: boolean
  }>(),
  { isEdit: false, showDelete: false, maxWidth: 560, saveDisabled: false }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: []
  delete: []
}>()

const { t } = useI18n()
const title = computed(() =>
  props.isEdit
    ? t('common.dialog.crud.titleEdit', { entity: props.entityName })
    : t('common.dialog.crud.titleAdd', { entity: props.entityName })
)

function close() {
  emit('update:modelValue', false)
}

function onSave() {
  emit('save')
}

function onDelete() {
  emit('delete')
}
</script>

<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :max-width="maxWidth"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
    <template #actions="{ close: closeFn }">
      <slot name="actions" :close="closeFn" :save="onSave" :delete="onDelete">
        <v-btn
          class="rounded-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          variant="text"
          @click="close"
        >
          {{ t('common.dialog.crud.buttonCancel') }}
        </v-btn>
        <v-btn
          v-if="showDelete"
          class="rounded-sm text-red-600 hover:bg-red-50"
          variant="text"
          @click="onDelete"
        >
          {{ t('common.dialog.crud.buttonDelete') }}
        </v-btn>
        <v-btn
          class="rounded-sm bg-[#2A5A7F] dark:bg-[#3d7ba8] text-white hover:opacity-90"
          color="primary"
          :disabled="saveDisabled"
          @click="onSave"
        >
          {{ t('common.dialog.crud.buttonSave') }}
        </v-btn>
      </slot>
    </template>
  </AppDialog>
</template>
